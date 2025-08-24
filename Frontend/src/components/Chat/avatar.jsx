import React from 'react';

// A simple function to generate a color based on a string (like a username)
const generateColor = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`;
    const textColor = `hsl(${hash % 360}, 100%, 25%)`;
    return { backgroundColor: color, color: textColor };
};

function Avatar({ name }) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const style = generateColor(name);

    return (
        <div 
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={style}
        >
            {initial}
        </div>
    );
}

export default Avatar;