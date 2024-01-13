function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return Math.abs(hash);
}

export default function Avatar({userId, username, online}){
    const colors = ['bg-red-300', 'bg-green-300', 'bg-purple-300', 'bg-blue-300', 'bg-yellow-300', 'bg-teal-300', 'bg-orange-300', 'bg-indigo-300']
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = hashCode(username) % colors.length;
    const color = colors[colorIndex];
    return (
        <div className={"w-8 h-8 relative rounded-full flex items-center " + color}>
            <div className="text-center w-full opacity-70">{username[0]}</div>
            {online && (
                <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border-white"></div>
            )}
            {!online && (
                <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border-white"></div>
            )}
        </div>
    );
}