// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {
        unique: true,
        index: true,
        type: String
  },
  tricks: [{type: Schema.Types.ObjectId, ref: 'Trick'}],
},{
    timestamps: true
});

UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UserSchema);