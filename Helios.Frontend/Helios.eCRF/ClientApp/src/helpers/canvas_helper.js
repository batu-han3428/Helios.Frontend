function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

export const createAvatarFromInitials = (name, size, textColor) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();

    const backgroundColor = stringToColor(name);

    canvas.width = size;
    canvas.height = size;

    context.fillStyle = backgroundColor;
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
    context.fill();

    context.fillStyle = textColor;
    const fontSize = size / 3;
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL();
};
