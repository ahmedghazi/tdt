// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TrickSchema = new Schema({
  name: String,
  status: {
  	type: Boolean,
  	default: false
  }
},{
    timestamps: true
});

TrickSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Trick', TrickSchema);