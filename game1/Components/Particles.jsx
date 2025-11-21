import React from 'react';

const Particles = ({ particles }) => {
  return (
    <>
      {particles.map(particle => {
        const opacity = particle.life / particle.maxLife;
        return (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: opacity,
              transform: `translate(-50%, -50%)`
            }}
          />
        );
      })}
    </>
  );
};

export default Particles;

