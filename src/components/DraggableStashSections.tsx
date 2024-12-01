import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TrashIcon } from 'lucide-react';
import { StashSection } from '@/constants/types';

interface DraggableStashSectionsProps {
  stashSections: StashSection[];
  isEditing: boolean;
  handleSectionChange: (newSections: StashSection[]) => void;
  removeSection: (index: number) => void;
}

const DraggableStashSections: React.FC<DraggableStashSectionsProps> = ({
  stashSections,
  isEditing,
  handleSectionChange,
  removeSection,
}) => {
  const [sections, setSections] = useState<(StashSection & { id: string })[]>([]);

  useEffect(() => {
    // Assign unique IDs to each section
    const sectionsWithIds = stashSections.map((section, index) => ({
      ...section,
      id: `section-${index}-${Date.now()}`,
    }));
    setSections(sectionsWithIds);
  }, [stashSections]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
    handleSectionChange(items);
  };

  const handleIndividualSectionChange = (id: string, content: string) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, content } : section
    );
    setSections(newSections);
    handleSectionChange(newSections);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="stashSections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8 mt-8">
            {sections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={!isEditing}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-dark-2 rounded-lg p-6 shadow-lg border border-dark-4 ${snapshot.isDragging ? 'opacity-50' : ''
                      }`}
                  >
                    {section.type === 'text' ? (
                      isEditing ? (
                        <Textarea
                          value={section.content}
                          onChange={(e) => handleIndividualSectionChange(section.id, e.target.value)}
                          className="w-full min-h-[100px] bg-dark-1 text-light-1 border-dark-4 shadow-inner"
                        />
                      ) : (
                        <div className="prose prose-invert max-w-none">{section.content}</div>
                      )
                    ) : (
                      <div className="relative">
                        <CodeMirror
                          value={section.content}
                          height="200px"
                          theme="dark"
                          extensions={[javascript({ jsx: true })]}
                          editable={isEditing}
                          onChange={(value) => handleIndividualSectionChange(section.id, value)}
                          className="border border-dark-4 rounded-md overflow-hidden shadow-inner"
                        />
                      </div>
                    )}
                    {isEditing && (
                      <Button onClick={() => removeSection(index)} variant="destructive" className="mt-4 bg-red-600 hover:bg-red-700 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Remove Section
                      </Button>
                    )}
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
};

export default DraggableStashSections;