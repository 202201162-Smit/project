import React, { useState } from 'react';

const TagSelector = ({ selectedTags = [], onTagChange }) => {
  const [inputValue, setInputValue] = useState('');
  const options = [
    'Coding', 'Workshop', 'Career Fair',
    'Cultural Festival', 'Music', 'Theater',
    'Orientation', 'Party', 'Club Fair',
    'Resume Building', 'Networking', 'Leadership',
    'Intramural', 'Fitness', 'Tournament',
    'Social Justice', 'Mental Health', 'Diversity',
    'Game Night', 'Trivia', 'Talent Show'
  ];

  const handleSelect = (event) => {
    const value = event.target.value;
    if (value && !selectedTags.includes(value)) {
      const updatedTags = [...selectedTags, value];
      onTagChange(updatedTags);  // Notify parent component about the tag change
      setInputValue(''); // Clear the input field
    }
  };

  const removeTag = (tag) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    onTagChange(updatedTags);  // Notify parent component about the tag removal
  };

  return (
    <div style={{
      marginTop: '1vh', display: 'flex', alignItems: 'center', 
      flexWrap: 'wrap', border: '1px solid black', padding: '1vh', 
      borderRadius: '1vh', width: '90%'
    }}>
      <select
        value={inputValue}
        onChange={handleSelect}
        style={{
          border: 'none',
          outline: 'none',
          padding: '5px',
          minWidth: '100%',
          color: 'black'
        }}
      >
        <option value="" disabled>Select tags...</option>
        {options.map((option) => (
          <option key={option} value={option} style={{ color: 'white' }}>
            {option}
          </option>
        ))}
      </select>

      <div style={{
        display: 'flex', flexWrap: 'wrap', marginTop: '10px', 
        width: '100%'
      }}>
        {/* Display selected tags */}
        {selectedTags.map((tag) => (
          <span key={tag} style={{
            padding: '5px', border: '1px solid #ddd', margin: '2px', 
            borderRadius: '3px', backgroundColor: '#e0e0e0',
            display: 'flex', alignItems: 'center', color:'black'
          }}>
            {tag}
            <button 
              onClick={() => removeTag(tag)} 
              style={{
                marginLeft: '5px', background: 'none', border: 'none', 
                cursor: 'pointer', color: 'red', fontWeight: 'bold'
              }}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;