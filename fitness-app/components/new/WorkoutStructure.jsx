import { 
    DndContext, 
    DragOverlay, 
    closestCenter, 
    PointerSensor, 
    useSensor, 
    useSensors 
  } from '@dnd-kit/core';
  import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import ExerciseSearch from "./ExerciseSearch";
  import ExerciseStructure from "./ExerciseStructure";
  import { useState } from "react";
  import ScrollUp from '../library/ScrollUp';
import WeekLayout from './WeekStructure';
  
  // A wrapper for each sortable exercise item.
  function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }
  
  export default function WorkoutStructure({ workout, setWeekLayout, weekNo, autoRegulated, workoutIndex, weekIndex   }) {
    const [showModal, setShowModal] = useState(false);
    const [activeId, setActiveId] = useState(null);
  
    const toggleModal = () => setShowModal((prev) => !prev);
  
    const newExercise = (exercise) => {
      setWeekLayout((prevWeekLayout) => {
    
        // Update the workouts for the week at index weekNo
        const updatedWorkouts = prevWeekLayout[weekNo].workouts.map((w) =>
          w.workoutNo === workout.workoutNo
            ? { ...w, exercises: [...w.exercises, exercise] }
            : w
        );
    
        // Create a new week object with updated workouts
        const updatedWeek = { ...prevWeekLayout[weekNo], workouts: updatedWorkouts };
    
        // Replace the week at weekNo with the updated week, leaving others unchanged
        const newLayout = prevWeekLayout.map((week, idx) =>
          idx === weekNo ? updatedWeek : week
        );
    
        return newLayout;
      });
    };
    
  
    const updateWorkoutName = (e) => {
      const newName = e.target.value;
      setWeekLayout((prevWeekLayout) => {
        const newWeekLayout = [...prevWeekLayout];
        newWeekLayout[weekNo] = {
          ...newWeekLayout[weekNo],
          workouts: newWeekLayout[weekNo].workouts.map((w) =>
            w.workoutNo === workout.workoutNo ? { ...w, name: newName } : w
          ),
        };
        return newWeekLayout;
      });
    };
    
  
    const onDelete = (exercise) => {
      setWeekLayout((prevWeekLayout) => {
        const newWeekLayout = [...prevWeekLayout];
        newWeekLayout[weekNo] = {
          ...newWeekLayout[weekNo],
          workouts: newWeekLayout[weekNo].workouts.map((w) =>
            w.workoutNo === workout.workoutNo
              ? { ...w, exercises: w.exercises.filter((e) => e !== exercise) }
              : w
          ),
        };
        return newWeekLayout;
      });
    };
    
  
    // Set up sensors for dragging.
    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
  
    // When dragging starts, record the active id.
    const handleDragStart = (event) => {
      setActiveId(event.active.id);
    };
  
    // Handle reordering when drag ends.
    const handleDragEnd = (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;
    
      setWeekLayout((prevWeekLayout) => {
        const newWeekLayout = [...prevWeekLayout];
        newWeekLayout[weekNo] = {
          ...newWeekLayout[weekNo],
          workouts: newWeekLayout[weekNo].workouts.map((w) => {
            if (w.workoutNo === workout.workoutNo) {
              const oldIndex = w.exercises.findIndex((ex) => ex.id === active.id);
              const newIndex = w.exercises.findIndex((ex) => ex.id === over.id);
              return { ...w, exercises: arrayMove(w.exercises, oldIndex, newIndex) };
            }
            return w;
          }),
        };
        return newWeekLayout;
      });
    };
    
  
    // Find the dragged exercise data so we can render it in the overlay.
    const draggedExercise = workout.exercises.find(ex => ex.id === activeId);
  
    return (
      <>
        <div className="h-full min-w-[250px] bg-[var(--primary-bg)] overflow-x-hidden flex flex-col gap-2 shadow-md p-2 rounded-lg border border-[black]/5">
            
          <input
            value={workout.name}
            onChange={updateWorkoutName}
            className="border border-black/5 p-2 shadow-md rounded-lg outline-none"
          />
  
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={workout.exercises.map((exercise) => exercise.id)}
              strategy={verticalListSortingStrategy}
            >
              {workout.exercises.map((exercise, index) => (
                <SortableItem key={exercise.id} id={exercise.id}>
                  <ExerciseStructure
                    exercise={exercise}
                    onDelete={() => onDelete(exercise)}
                    autoRegulated={autoRegulated}
                    setWeekLayout={setWeekLayout}
                    weekIndex={weekIndex}
                    workoutIndex={workoutIndex}
                    exerciseIndex={index}
                  />
                </SortableItem>
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId && draggedExercise ? (
                <div className="p-1 border border-black/10 bg-white shadow-lg cursor-grabbing">
                  <ExerciseStructure 
                    exercise={draggedExercise} 
                    onDelete={() => {}} // disable delete in overlay
                    autoRegulated={autoRegulated}
                    setWeekLayout={setWeekLayout}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
  
          <button className="w-full bg-[var(--primary-bg)] py-1 cursor-pointer shadow-md border border-[black]/5 rounded-lg" onClick={toggleModal}>
            Add New +
          </button>
        </div>
        <ScrollUp
          modalShown={showModal}
          setModalShown={setShowModal}
        >
          <ExerciseSearch newExercise={newExercise} setShown={setShowModal} />
        </ScrollUp>
      </>
    );
  }
  