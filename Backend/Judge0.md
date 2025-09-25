<!-- Judge0 Status Code  -->
1 : In Queue – Your submission is waiting to be processed.
2 : Processing – Your submission is currently being executed.
3 : Accepted – Your program ran successfully and passed all tests.
4 : Wrong Answer – Your program ran but produced incorrect output.
5 : Time Limit Exceeded – Your program did not finish in the allowed time.
6 : Compilation Error – Your code failed to compile.
7 : Runtime Error (SIGSEGV, SIGABRT, etc.) – Your code crashed during execution.


<!-- Judge0 get batch request API -->

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': '7cbe0f5993mshcf86d1dc787b75cp1dc639jsndfc1837614f2',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
     submission
  }
 };

 async function fetchData() {
	try {
		const response = await axios.request(options);
        return response.data;
	} catch (error) {
		console.error(error);
	}
 }

 const result = await fetchData();

<!--  here result will be an array of token  -->
[
  {
    "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
  },
  {
    "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
  },
  {
    "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
  }
]


<!--  get batch submission result  API-->
const submitToken = async(resultToken)=>{
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(','), // here i will submit all token with , token1,token2,token3
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': '7cbe0f5993mshcf86d1dc787b75cp1dc639jsndfc1837614f2',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
	 try {
		 const response = await axios.request(options);
		 console.log(response.data);
	 } catch (error) {
		 console.error(error);
	 }
  }

 const result = await fetchData();
}

<!-- here result return answer following format -->
{
  "submissions": [
    {
      "language_id": 46,
      "stdout": "hello from Bash\n",
      "status_id": 3,
      "stderr": null,
      "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
    },
    {
      "language_id": 71,
      "stdout": "hello from Python\n",
      "status_id": 3,
      "stderr": null,
      "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
    },
    {
      "language_id": 72,
      "stdout": "hello from Ruby\n",
      "status_id": 3,
      "stderr": null,
      "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
    }
  ]
}


