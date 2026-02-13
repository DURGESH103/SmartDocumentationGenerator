const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card p-6 ${hover ? 'hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
