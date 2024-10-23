import React from 'react';
import Draggable from 'react-draggable';

interface FieldProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

export const DraggableField: React.FC<FieldProps> = ({ id, type, position, onPositionChange }) => {
  return (
    <Draggable
      position={position}
      onStop={(e, data) => onPositionChange(id, { x: data.x, y: data.y })}
      bounds="parent"
    >
      <div className="absolute cursor-move">
        <div className="bg-white border-2 border-blue-500 rounded p-2 shadow-md">
          <input
            type={type}
            placeholder={`${type} field`}
            className="w-32 px-2 py-1 text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </Draggable>
  );
};