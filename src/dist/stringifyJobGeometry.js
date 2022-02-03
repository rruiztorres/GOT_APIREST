//Formatea la geometria de jobs para la insercion en BD

module.exports = function stringifyJobGeometry(geometry) {

    this.coordinates = geometry.coordinates[0];
    this.string = "POLYGON((";
    for (let index in this.coordinates) {
        this.coordinate = this.coordinates[index].toString();
        this.coordinate = this.coordinate.replace(',',' ');
        this.string = this.string + this.coordinate + ','
    }
    this.string = this.string + '))';
    this.string = this.string.replace(",))", "))");

    return this.string;
}
        
