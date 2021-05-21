const mongoose = require('mongoose')
const db = mongoose.connection;
const Post = require('../models/posts')
mongoose.connect('mongodb://localhost:27017/Quora', { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'CONNECTION PROBLEM'))
db.once('open', () => {
    console.log("CONNECTED TO THE DATABASE")
})


const seedDB = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const Posts = new Post({
            author: '60a76dcf9ef5fe0557b263ed',
            question: 'Scientifically and medically, why, all things being equal, is being fat unhealthy compared to being at a normal weight?',
            subject: 'Science',
            body: 'Because in most cases, if you are fat, that means you have a lot of fat around your organs most dangerously around your heart.Which increases chances of getting heart attacks or failure then death.When you are faced with danger or fear, your heart pumps a lot faster.If it’s clogged by fat, it simply won’t be able to pump fast enough leading to heart failure.That’s partly the reason why heart disease is the leading cause of death among humans according to center for disease control(CDC).Yes, you heard right.Forget covid.Visceral fat also lowers cognition.Increases risk of developing some cancers.Increases risk of getting heart disease.',
            image: 'https://picsum.photos/1024',
            upVotes: 70,
            downVotes: 2,
        })
        await Posts.save();
    }
}


seedDB().then(() => {
    db.close();
})