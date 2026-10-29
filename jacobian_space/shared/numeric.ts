/** Keep SVG attributes stable between server and browser floating-point engines. */
export const svgCoordinate = (value: number) => +value.toFixed(4);
