import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const defaultData = {
  todo: [{ id: '1', title: 'Task 1' }],
  doing: [{ id: '2', title: 'Task 2' }],
  done: [{ id: '3', title: 'Task 3' }],
};

export default function KanbanBoard() {
  const [data, setData] = useState(defaultData);

  // load localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanban');
    if (saved) setData(JSON.parse(saved));
  }, []);

  // save localStorage
  useEffect(() => {
    localStorage.setItem('kanban', JSON.stringify(data));
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = [...data[sourceCol]];
    const destItems = [...data[destCol]];

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceItems.splice(destination.index, 0, movedItem);
      setData({ ...data, [sourceCol]: sourceItems });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        [sourceCol]: sourceItems,
        [destCol]: destItems,
      });
    }
  };

  const renderColumn = (key: string, title: string) => (
    <Col span={8}>
      <Card title={title}>
        <Droppable droppableId={key}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data[key].map((item: any, index: number) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ marginBottom: 10 }}
                    >
                      {item.title}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card>
    </Col>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Row gutter={16}>
        {renderColumn('todo', 'Cần làm')}
        {renderColumn('doing', 'Đang làm')}
        {renderColumn('done', 'Hoàn thành')}
      </Row>
    </DragDropContext>
  );
}