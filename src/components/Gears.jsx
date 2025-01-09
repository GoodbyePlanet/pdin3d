import './Gears.css';

export default function Gears() {
  const handleAuthorClick = () => window.open('https://github.com/GoodbyePlanet', '_blank');

  return (
    <div onClick={handleAuthorClick} className="wrapper">
      <div className="gears">
        <div className="gearsContainer">
          <div className="gearRotate"></div>
          <div className="gearRotateLeft"></div>
        </div>
      </div>
    </div>
  );
};
