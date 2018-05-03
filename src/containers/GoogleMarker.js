export default (props, map, center) => {
  function pinSymbol(props) {
    return {
      path:
        props.path ||
        'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
      fillColor: props.color || '#FE7569',
      fillOpacity: 1,
      strokeColor: props.borderColor || '#000',
      strokeWeight: 2,
      scale: 1
    };
  }

  const marker = new google.maps.Marker({
    position: center,
    map: map,
    icon: props.icon
      ? {
          url: props.icon,
          scaledSize: new google.maps.Size(50, 50)
        }
      : pinSymbol(props)
  });

  return marker;
};
