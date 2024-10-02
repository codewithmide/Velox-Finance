const getRandomColor = () => {
    const colors = ["#f39c12", "#e74c3c", "#8e44ad", "#3498db", "#2ecc71", "#e67e22"];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const generateGravatar = (text: string) => {
    const firstLetter = text[0].toUpperCase();
    const bgColor = getRandomColor();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="${bgColor}" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="white">${firstLetter}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};
