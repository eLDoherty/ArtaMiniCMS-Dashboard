"use client";

import { Card, Button, Form, Input } from "antd";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export interface PageBuilderBlock {
  id: string;
  name: string;
  type: string;
  fields: Record<string, string>;
}

interface PageBuilderProps {
  content: PageBuilderBlock[];
  onDragEnd: (result: DropResult) => void;
  onRemoveBlock: (id: string) => void;
  onFieldChange: (id: string, field: string, value: string) => void;
}

export default function PageBuilder({
  content,
  onDragEnd,
  onRemoveBlock,
  onFieldChange,
}: PageBuilderProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <Droppable droppableId="content-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              padding: 16,
              minHeight: 120,
              backgroundColor: "#fafafa"
            }}
          >
            {content.length === 0 && (
              <Card
                type="inner"
                style={{
                  border: "2px dashed #d9d9d9",
                  background: "#fafafa",
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#999",
                }}
              >
                <div style={{ fontSize: 16, marginBottom: 8 }}>
                  Content Builder Area
                </div>
                <div style={{ fontSize: 13 }}>
                  Choose components on the right panel to show it here
                  <br />
                  You can drag and drop the order
                </div>
              </Card>
            )}

            {content.map((block, index) => (
              <Draggable
                key={block.id}
                draggableId={block.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      marginBottom: 16,
                      ...provided.draggableProps.style,
                    }}
                  >
                    <Card
                      title={`${block.name} (${block.type})`}
                      extra={
                        <Button
                          danger
                          size="small"
                          onClick={() => onRemoveBlock(block.id)}
                        >
                          ✕
                        </Button>
                      }
                    >
                      <div
                        {...provided.dragHandleProps}
                        style={{
                          cursor: "move",
                          marginBottom: 12,
                          fontSize: 12,
                          color: "#999",
                        }}
                      >
                        ⠿ Drag to reorder
                      </div>

                      {Object.entries(block.fields).map(([key, value]) => (
                        <Form.Item key={key} label={key}>
                          <Input
                            value={value}
                            onChange={(e) =>
                              onFieldChange(
                                block.id,
                                key,
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      ))}
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
