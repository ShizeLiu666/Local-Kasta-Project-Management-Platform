import React from 'react';
import PropTypes from 'prop-types';
import './ComponentCard.css';

const ComponentCard = ({ children, title, subtitle, headerAction, showTitle = true }) => {
  return (
    <div className="component-card">
      {showTitle && (
        <div className="component-card-title">
          <div className="component-card-title-content">
            {title}
          </div>
          {headerAction && (
            <div className="component-card-header-action">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="component-card-body">
        {subtitle && <div className="component-card-subtitle">{subtitle}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

ComponentCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  headerAction: PropTypes.node,
  showTitle: PropTypes.bool
};

ComponentCard.defaultProps = {
  headerAction: null,
  showTitle: true
};

export default ComponentCard;
