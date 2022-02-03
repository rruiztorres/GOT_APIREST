//Formatea la geometria de jobs para la insercion en BD

module.exports = function stringifyErrorGeometry(geometry){
    this.coordinates = geometry.coordinates;
    this.string = 'POINT(';
    this.coordinate = this.coordinates.toString();
    this.coordinate = this.coordinate.replace(',',' ');
    this.string = this.string + this.coordinate;
    this.string = this.string + ')';
    return this.string;
}