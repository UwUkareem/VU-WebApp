import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

export function Tabs({ items = [], className = '' }) {
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (!tabsRef.current) return;

    const activeTab = tabsRef.current.querySelector('.tab--active');
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [items]);

  return (
    <div ref={tabsRef} className={`tabs ${className}`.trim()} role="tablist">
      <span className="tabs__indicator" style={indicatorStyle} aria-hidden="true" />
      {items.map((item, index) => (
        <Tab key={index} label={item.label} isActive={item.isActive} onClick={item.onClick} />
      ))}
    </div>
  );
}

function Tab({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`tab${isActive ? ' tab--active' : ''}`}
      onClick={onClick}
    >
      <span className="tab__label">{label}</span>
    </button>
  );
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
