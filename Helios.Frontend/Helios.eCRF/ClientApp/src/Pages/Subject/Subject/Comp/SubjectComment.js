import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import { Dropdown, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { formatDate } from '../../../../helpers/format_date';
import { createAvatarFromInitials } from '../../../../helpers/canvas_helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useLazyGetSubjectCommentsQuery, useRemoveSubjectCommentMutation, useSetSubjectCommentMutation } from '../../../../store/services/Subject';
import Swal from 'sweetalert2';
import { showToast } from '../../../../store/toast/actions';

const MessageOptions = ({ t, onEdit, onDelete }) => {
    const handleMenuClick = (e) => {
        if (e.key === '0') {
            onEdit();
        } else if (e.key === '1') {
            onDelete();
        }
    };

    const items = [
        {
            label: t('Edit'),
            key: '0',
        },
        {
            label: t('Delete'),
            key: '1',
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
                <FontAwesomeIcon style={{ color:'#ffc603' }} icon="fa-solid fa-ellipsis-vertical" />
            </Space>
        </Dropdown>
    );
};

const SubjectComment = props => {

    const dispatch = useDispatch();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const [editMessageContent, setEditMessageContent] = useState("");
    const [editMessageId, setEditMessageId] = useState(null);
    const [comments, setComments] = useState([]);
    
    const [setSubjectComment] = useSetSubjectCommentMutation();

    const handleSaveAndUpdate = async (id, message) => {
        try {
            dispatch(startloading());
            let data = {
                id: 0,
                elementId: props.subjectElementId,
                comment: message,
                commentType:1,
            };
            if (id !== 0) data.id = id;
            const response = await setSubjectComment(data);
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

    const [removeSubjectComment] = useRemoveSubjectCommentMutation();

    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: props.t("This message will be deleted."),
                text: props.t("Do you confirm?"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3bbfad",
                confirmButtonText: props.t("Yes"),
                cancelButtonText: props.t("Cancel"),
            }).then(async (result) => {
                if (result.isConfirmed) {
                    dispatch(startloading());
                    const response = await removeSubjectComment(id);
                    dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                    dispatch(endloading());
                } else {
                    return false;
                }
            });
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
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

    const [trigger, { data: commentData, error, isLoading }] = useLazyGetSubjectCommentsQuery();

    useEffect(() => {
        if (props.subjectElementId) {
            dispatch(startloading());
            trigger(props.subjectElementId);
        }
    }, [props.subjectElementId]);

    useEffect(() => {
        if (!isLoading && !error && commentData) {
            setComments(commentData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [commentData, error, isLoading]);

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
            <MessageList>
                {comments.length > 0 ? comments.map((comment, i) => (
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
                                <MessageInput value={editMessageContent} onChange={(m) => { setEditMessageContent(m) }} style={{ minWidth: '200px' }} placeholder={props.t("Type message here")} fancyScroll={false} attachButton={false} onSend={(m) => handleSaveAndUpdate(comment.id, m)} />
                            )
                            :
                            (
                                <div style={messageContainerStyle}>
                                    <div style={{
                                        flex: 1,
                                        wordBreak: 'break-word',
                                        marginLeft: userInformation.userId == comment.senderId ? '20px' : '0',
                                    }}>
                                        {comment.comment}
                                     </div>
                                    {userInformation.userId == comment.senderId && 
                                        <div style={messageOptionsStyle}>
                                            <MessageOptions t={props.t} onEdit={() => handleEdit(comment.id, comment.comment)} onDelete={() => handleDelete(comment.id)} />
                                        </div>
                                    }                                   
                                </div>
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
                    <MessageList.Content>{props.t("No comment for this field !")}</MessageList.Content>
                )}
            </MessageList>
            <MessageInput fancyScroll={false} attachButton={false} onSend={(m) => { handleSaveAndUpdate(0, m) }} placeholder={props.t("Type message here")} />
        </ChatContainer>
    );
};

SubjectComment.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectComment);