import React from "react";
import {Form} from 'antd';
import EditableContext from './EditableContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const EditableRow = ({ ranking, ...props }) => {
    const [form] = Form.useForm();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            },
        ),
        transition,
        cursor: 'move',
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} ref={ranking ? setNodeRef : undefined} style={ranking ? style : undefined} {...(ranking ? attributes : {})} {...(ranking ? listeners : {})} />
            </EditableContext.Provider>
        </Form>
    );
};

export default EditableRow;