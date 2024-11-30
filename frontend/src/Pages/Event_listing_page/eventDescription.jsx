import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import './eventdescription.scss';
import 'react-quill/dist/quill.snow.css';

const EventDescription = ({ description, onDescriptionChange }) => {
  const [text, setText] = useState(description || '');

  useEffect(() => {
    setText(description); // Synchronize with the parent-provided description prop if it changes
  }, [description]);

  const handleTextChange = (value) => {
    setText(value);
    onDescriptionChange(value); // Update parent component’s state
  };

  return (
    <div className="event-description">
      {/* <label htmlFor="EventDescription">
        <strong>About Event</strong> <span style={{ color: 'red' }}>*</span>
      </label> */}
      <ReactQuill
        id="EventDescription"
        value={text}
        onChange={handleTextChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
          ],
        }}
        placeholder={`Guidelines:
- Mention all the guidelines like eligibility, format, etc.
- Inter-college team members allowed or not.
- Inter-specialization team members allowed or not.
- The number of questions/problem statements.
- Duration of the rounds.

Rules:
- Mention the rules of the competition.`}
      />
      <p style={{ fontSize: 'small', color: 'grey' }}>Minimum Word Limit: 500</p>
    </div>
  );
};

export default EventDescription;