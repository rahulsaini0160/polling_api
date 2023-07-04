const Question = require("../models/question");
const Option = require('../models/option');

//Create Question
const createQuestion = async (req, res) => {
    try {
        const question = new Question({
            title: req.body.title
        })
        await question.save();
        if (question) {
            return res.status(200).json(question);
        }
        return res.status(400).json({ Msg: "Error while Creating Question" })
    } catch (error) {
        return res.status(500).json({ Error: error });
    }
}

//Create Options
const createOptions = async (req, res) => {
    try {
        //Find the Question by ID
        const question = await Question.findById(req.params.id);
        //If Question found
        if (question) {
            //Create Option
            const options = new Option({
                text: req.body.text,
                question: question.id
            });
            //If option created
            if (options) {
                //Add link to the options for vote
                options.link_to_vote = `http://localhost:5000/options/${options.id}/add_vote`;
                options.save();
                //Add option inside Question options array
                question.options.push(options._id);
                question.save();
                return res.status(200).json({
                    Success: "Option Added to Question",
                    Option: options
                })
            }
        }
        else{
            //Question is not found
            return res.status(404).json({ "Error": "Question Not Found!" })
        }
    } catch (error) {
        return res.status(500).json({ "Error": error });
    }
}

//View Question by ID
const viewQuestion = async (req, res) => {
    try {
        //Find Question by id and populate options array
        const question = await Question.findById(req.params.id).populate({
            path: 'options',
            select: "id text votes link_to_vote"
        });
        //If question found
        if (question) {
            return res.status(200).json(question);
        }
        else{
            return res.status(404).json({"Message":"Question not found!"});
        }
    } catch (error) {
        return res.status(500).json({ "Error": error });
    }
}

//Delete Quesiton
const deleteQuestion = async (req, res) => {
    try {
        //FInd Question by id and populate options array
        const question = await Question.findById(req.params.id).populate({
            path: 'options',
            select: 'id text votes link_to_vote'
        })
        //If Quesiton found
        if (question) {
            //Check for votes if any option has more than zero vote
            let hasVote = false;
            for(let elem of question.options){
                //If option has vote more than zero return true
                if(elem.votes>0){
                    hasVote=true;
                    break;
                }
            }
            //If all option has zero votes
            if (!hasVote) {
                //Remove Question from DB
                question.remove();
                //Remove all Options from Question Array
                await Option.deleteMany({question:question.id});
                return res.status(200).json({ "Success": "Question is deleted" });
            }
            else {
                //Any option has more than zero votes. So, We cannot delete Question
                return res.status(401).json({ "Message": "Question cannot be deleted" })
            }
        }
        return res.status(404).json({ "Message": "Question not found" });
    } catch (error) {
        return res.status(500).json({ "Error": error });
    }
}

module.exports = { createQuestion, createOptions, viewQuestion, deleteQuestion };