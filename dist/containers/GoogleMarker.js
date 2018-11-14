'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (props, map, center) {
  function pinSymbol(props) {
    return {
      path: props.path || 'm25.6 14.3q0-2.4-1.6-4.1t-4.1-1.6-4 1.6-1.7 4.1 1.7 4 4 1.7 4.1-1.7 1.6-4z m5.8 0q0 2.4-0.8 4l-8.1 17.3q-0.4 0.7-1.1 1.1t-1.5 0.4-1.5-0.4-1-1.1l-8.2-17.3q-0.7-1.6-0.7-4 0-4.7 3.3-8.1t8.1-3.3 8.1 3.3 3.4 8.1z',
      fillColor: props.color || '#ff671b',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 1
    };
  }

  var marker = new google.maps.Marker({
    position: center,
    map: map,
    icon: props.icon ? {
      url: props.icon,
      scaledSize: new google.maps.Size(50, 50)
    } : pinSymbol(props)
    // draggable: true
  });
  marker.addListener('click', function () {
    console.log('You clicked the center');
  });

  return marker;
};

module.exports = exports['default'];
//# sourceMappingURL=GoogleMarker.js.map