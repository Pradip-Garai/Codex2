<!-- pagination -->
const page = 2
const limit = 10
const skip = (page-1)*10
await Problem.find().skip(20).limit(10);

<!-- find problems with greater than 100 likes and topics wise -->
Problem.find({
   vote: {$gte: 100},
   tags: {$in: ["array","hashmap"]}
})

<!-- Operators and meaning -->
Operator     Meaning                Example URL Query               MongoDB equivalent
---------------------------------------------------------------------------------------------------
$eq          Equal                  ?difficulty=easy                {difficulty: "easy"}
$ne          Not Equal              ?difficulty[ne]=hard            {difficulty: {$ne: "hard"}}
$gt          Greater Than           ?votes[gt]=100                  {votes: {$gt: 100}}
$gte         Greater Than Equals    ?votes[gte]=100                 {votes: {$gte: 100}}
$lt          Less Than              ?votes[lt]=50                   {votes: {$lt: 50}}
$lte         Less Than Equals       ?votes[lte]=50                  {votes: {$lte: 50}}
$in          Match Any (Array)      ?category[in]=js,python         {category: {$in: ["js","python"]}}
$nin         Not In (Array)         ?category[nin]=php,java         {category: {$nin: ["php","java"]}}
$regex       Pattern Matching       ?title[regex]=^Mongo            {title: {$regex: "^Mongo"}}
$exists      Field Exists           ?email[exists]=true             {email: {$exists: true}}
$all         Match All (Array)      ?tags[all]=node,express         {tags: {$all: ["node","express"]}}
$size        Array Length Match     ?tags[size]=3                   {tags: {$size: 3}}



<!-- resultToken  -->
<!-- 
    language_id: 102,
    stdin: '5',
    expected_output: '1\n2\nFizz\n4\nBuzz',
    stdout: '1\n2\nFizz\n4\nBuzz\n',
    status_id: 3,
    created_at: '2025-08-23T12:52:28.367Z',
    finished_at: '2025-08-23T12:52:29.797Z',
    time: '1.125',
    memory: 52792,
    stderr: null,
    token: '8b82a137-f774-4de8-86df-8244589fe385', 
    
-->