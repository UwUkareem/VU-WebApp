import { useRef, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

const EMPTY_ITEMS = [];

export const Tabs = memo(function Tabs({ items = EMPTY_ITEMS, className = '', scrollRef }) {
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector('.tab--active');
    if (activeTab) {
      setIndicatorStyle({
        left: `${activeTab.offsetLeft}px`,
        width: `${activeTab.offsetWidth}px`,
      });
    }
  }, [items]);

  return (
    <div ref={tabsRef} className={['tabs', className].filter(Boolean).join(' ')} role="tablist">
      <span className="tabs__indicator" style={indicatorStyle} aria-hidden="true" />
      {items.map((item, index) => (
        <Tab
          key={index}
          label={item.label}
          isActive={item.isActive}
          onClick={() => {
            item.onClick?.();
            if (scrollRef?.current) scrollRef.current.scrollTop = 0;
          }}
        />
      ))}
    </div>
  );
});

const Tab = memo(function Tab({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={['tab', isActive && 'tab--active'].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <span className="tab__label">{label}</span>
    </button>
  );
});

Tabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
  scrollRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
