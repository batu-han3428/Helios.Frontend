import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { ChatContainer, MessageList, Message, MessageInput, Avatar, ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Dropdown, Space, Button, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { formatDate } from '../../../../helpers/format_date';
import { createAvatarFromInitials } from '../../../../helpers/canvas_helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useLazyGetSubjectQueriesQuery, useSetSubjectQueryMutation } from '../../../../store/services/Subject';
import { showToast } from '../../../../store/toast/actions';
import { QueryIconStatu } from '../../../../helpers/icon_helper';
import Swal from 'sweetalert2';

const MessageOptions = ({ t, onEdit }) => {
    const handleMenuClick = (e) => {
        if (e.key === '0') {
            onEdit();
        }
    };

    const items = [
        {
            label: t('Edit'),
            key: '0',
        }
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <Dropdown
            trigger={['click']}
            menu={menuProps}
        >
            <Space style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon style={{ color: '#ffc603' }} icon="fa-solid fa-ellipsis-vertical" />
            </Space>
        </Dropdown>
    );
};

const SubjectQuery = props => {

    const dispatch = useDispatch();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const [editMessageContent, setEditMessageContent] = useState("");
    const [editMessageId, setEditMessageId] = useState(null);
    const [comments, setComments] = useState([]);

    const [setSubjectQuery] = useSetSubjectQueryMutation();

    const closeQuery = async (id, message, commentData) => {
        Swal.fire({
            title: props.t("This query will be closed."),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    handleSaveAndUpdate(id, message, commentData, true);
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire('An error occurred', '', 'error');
                }
            }
        });
    };

    const handleSaveAndUpdate = async (id, message, commentData, close = false) => {
        try {
            dispatch(startloading());
            const no = commentData.length > 0 ? commentData[0].no : 0;
            let commentType;
            if (close) {
                commentType = 3;
            }else if (no === 0) {
                commentType = 4;
            } else {
                const allCommentsByUser = commentData.every(comment => comment.senderId === userInformation.userId);
                const firstComment = commentData[0];
                const isFirstCommentByUser = firstComment.senderId === userInformation.userId;
                if (allCommentsByUser) {
                    commentType = 4;
                } else {
                    if (isFirstCommentByUser) {
                        commentType = 4;
                    } else {
                        commentType = 5;
                    }
                }
            }
            let data = {
                id: 0,
                no: no,
                elementId: props.subjectElementId,
                comment: message,
                commentType: commentType,
                subjectId: props.subjectId
            };
            if (id !== 0) data.id = id;
            const response = await setSubjectQuery(data);
            if (response.data.isSuccess) {
                setEditMessageId(null);
                setEditMessageContent("");
                dispatch(showToast(props.t(response.data.message), true, true));
                dispatch(endloading());
            } else {
                dispatch(showToast(props.t(response.data.message), true, false));
                dispatch(endloading());
            }
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred.", true, false)));
            dispatch(endloading());
        }
    }

    const handleEdit = (id, comment) => {
        setEditMessageId(id);
        setEditMessageContent(comment);
    };

    const messageContainerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        padding: '5px 0',
    };

    const messageOptionsStyle = {
        position: 'absolute',
    };

    const [trigger, { data: queryData, error, isLoading }] = useLazyGetSubjectQueriesQuery();

    useEffect(() => {
        if (props.subjectElementId) {
            dispatch(startloading());
            trigger(props.subjectElementId);
        }
    }, [props.subjectElementId]);

    const goToQueryElement = () => {
        props.navigate();
    };

    useEffect(() => {
        if (!isLoading && !error && queryData) {
            const iconInf = QueryIconStatu(queryData.length > 0 ? queryData[queryData.length - 1].commentType : 0);
            props.refs.current.setModalTitle(
                <div style={{ display: 'flex'}}>
                    <div>
                        <span>{props.t('Query no')}: #{queryData.length > 0 ? queryData[0].no : null}</span>
                        <br />
                        <span>{props.t('Subject')}: {props.subjectNumber} - {queryData.length > 0 ? formatDate(queryData[0].commentTime) : null}</span>
                        <br />
                        <br />
                        {(props.permissions.openQuery && queryData.length > 0) && 
                            <>
                                <Button style={{ background: '#5b626b', color: 'white', marginRight: '5px' }} icon={<FontAwesomeIcon icon="fas fa-directions" style={{ color: "white" }} />}>
                                    {props.t('Audit trail')}
                                </Button>
                                {props.isQueryList && 
                                    <Button 
                                        style={{ background: '#427CB9', color: 'white', marginRight: '5px' }}
                                        icon={<FontAwesomeIcon icon="fa-solid fa-file-lines" style={{ color: "white" }} />}
                                        onClick={goToQueryElement}
                                    >
                                        {props.t('Go to element')}
                                    </Button>
                                }                                
                                {(queryData[0].senderId === userInformation.userId && queryData[queryData.length - 1].commentType !== 3) &&
                                    <Button style={{ background: '#FAA665', color: 'white' }} icon={<FontAwesomeIcon icon="fa-solid fa-x" style={{ color: "white" }} />} onClick={() => { closeQuery(0, queryData[queryData.length - 1].comment, queryData) }}>
                                        {props.t('Close query')}
                                    </Button>
                                }
                            </>
                        }
                    </div>                      
                    <span style={{ marginLeft: 'auto', alignSelf: 'end' }}>
                        {props.t('Query status')}: <Tooltip title={props.t(iconInf.text)}>{iconInf.icon}</Tooltip>
                    </span>                       
                </div>
            );         
            setComments(queryData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [queryData, error, isLoading, userInformation.userId, props.isQueryList]);

    const toggleAlignSelf = (id, add) => {
        const section = document.getElementById(id);
        if (section) {
            const avatarDiv = section.querySelector('.cs-message__avatar');
            if (avatarDiv) {
                if (add) {
                    avatarDiv.classList.add('align-center');
                } else {
                    avatarDiv.classList.remove('align-center');
                }
            }
        }
    };

    useEffect(() => {
        if (editMessageId) {
            toggleAlignSelf(editMessageId, true);
        } else {
            comments.forEach((comment) => {
                toggleAlignSelf(comment.id, false);
            });
        }
    }, [editMessageId, comments]);

    return (
        <ChatContainer
            style={{
                height: '500px'
            }}
        >
            {comments.length > 0 && 
                <ConversationHeader>
                    <ConversationHeader.Content
                        info={props.currentData.elementName + ": " + props.currentData.value}
                        userName="Current data"
                    />
                </ConversationHeader>
            }
            <MessageList>
                {comments.length > 0 ? comments.filter(comment => comment.commentType !== 6).map((comment, i) => (
                    (comment.commentType === 3) ? <div style={{ textAlign: 'center', color: '#F5C20E' }}><span>* {props.t('Query is closed')} *</span><br /><span style={{ color: '#F5C20E' }}>{formatDate(comment.commentTime)}</span><br /><span>Kapatan kullanıcı: {comment.senderName}</span></div> :
                    <Message
                        model={{
                            direction: userInformation.userId == comment.senderId ? 'outgoing' : 'incoming',
                            position: 'single',
                        }}
                        id={comment.id}
                        key={i}
                        className={userInformation.userId == comment.senderId ? 'outgoing-message' : 'incoming-message'}
                    >
                        <Message.Header sentTime={formatDate(comment.commentTime)}></Message.Header>
                        <Avatar
                            src={createAvatarFromInitials(comment.senderName, 50, '#ffffff')}
                            alt="Avatar"
                        />
                        <Message.CustomContent>
                            {editMessageId === comment.id ? (
                                <MessageInput value={editMessageContent} onChange={(m) => { setEditMessageContent(m) }} style={{ minWidth: '200px' }} placeholder={props.t("Type message here")} fancyScroll={false} attachButton={false} onSend={(m) => handleSaveAndUpdate(comment.id, m, comments)} />
                            )
                            :
                            (
                                (comment.commentType === 3 ? <><span>* {props.t('Query is closed')} *</span><br /><span>{formatDate(comment.commentTime)}</span></> :
                                <div style={messageContainerStyle}>
                                    <div style={{
                                        flex: 1,
                                        wordBreak: 'break-word',
                                        marginLeft: userInformation.userId == comment.senderId ? '20px' : '0',
                                        }}>
                                            {comment.comment}
                                    </div>
                                    {(userInformation.userId == comment.senderId && queryData[queryData.length - 1].commentType !== 3) &&
                                        <div style={messageOptionsStyle}>
                                            <MessageOptions t={props.t} onEdit={() => handleEdit(comment.id, comment.comment)} />
                                        </div>
                                    }
                                        </div>
                                )
                            )}
                        </ Message.CustomContent >
                        {editMessageId === comment.id && (
                            <Message.Footer>
                                <CloseOutlined onClick={() => setEditMessageId(null)} className='close-button' />
                            </Message.Footer>
                        )}
                    </Message>
                ))
                :
                (
                    <MessageList.Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>{props.t("No query for this field!")}</MessageList.Content>
                )}
            </MessageList>
            <MessageInput
                disabled={
                    (
                        (comments.length > 0 && comments[comments.length - 1].commentType === 3 && props.permissions.answerQuery)
                        ||
                        (comments.length < 1 && props.permissions.answerQuery && !props.permissions.openQuery)
                    )
                }
                fancyScroll={false} attachButton={false} onSend={(m) => { handleSaveAndUpdate(0, m, comments) }} placeholder={props.t("Type message here")} />
        </ChatContainer>
    );
};

SubjectQuery.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectQuery);