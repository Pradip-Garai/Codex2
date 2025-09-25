const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        required:true,
        enum:['easy','medium','hard']
    },
    tags:{
        type:String,
        required:true,
    }, 
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true  
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true  
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    referenceSolution:[
       {
           language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
       }
    ],
    problemContributor:{
        type:Schema.Types.ObjectId, // take contributor _id 
        ref:'user',    // make relation with user collection with take a reference 
        required:true
    }
});

const Problem = mongoose.model('problems',problemSchema);

module.exports = Problem;