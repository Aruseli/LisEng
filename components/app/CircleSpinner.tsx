'use client';

export const CircleSpinner = ({label, className}: {label?: string, className?: string}) => {
  return (
    <div className="flex items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="Загрузка..." 
        role="img"
        className={`primary_fill size-8 mr-2 ${className}`}
      >
        <g>
          <circle cx="50" cy="15" r="6"/>  {/* 270 deg (Top) */}
          <circle cx="74.7" cy="25.3" r="6" fillOpacity="0.875"/> {/* 315 deg */}
          <circle cx="85" cy="50" r="6" fillOpacity="0.75"/>   {/* 0 deg (Right) */}
          <circle cx="74.7" cy="74.7" r="6" fillOpacity="0.625"/> {/* 45 deg */}
          <circle cx="50" cy="85" r="6" fillOpacity="0.5"/>    {/* 90 deg (Bottom) */}
          <circle cx="25.3" cy="74.7" r="6" fillOpacity="0.375"/> {/* 135 deg */}
          <circle cx="15" cy="50" r="6" fillOpacity="0.25"/>   {/* 180 deg (Left) */}
          <circle cx="25.3" cy="25.3" r="6" fillOpacity="0.125"/> {/* 225 deg */}

          <animateTransform 
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"     
            to="360 50 50"     
            dur="1s"           
            repeatCount="indefinite" 
          />
        </g>
      </svg>
      {label}
    </div>
  );
};