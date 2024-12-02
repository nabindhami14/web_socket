const axios = require("axios");

const options = {
  method: "POST",
  url: "http://202.166.194.89:8888/api/Ipg/ValidateCapitalMarketCustomer",
  data: {
    CSID: "CS1101369",
    Token: "Cp375hBrzRf48OiriNPFyg==",
  },
  headers: {
    Authorization: "Basic Q29yZV9Vc2VyOnlQemRlQmtDWUNXNWhDeWRJUStiZnc9PQ==",
    Signature:
      "e8ba2846ca817c7fc9a294cede5ba99f2c1602f1c38aded12d19207961396e57e3697e17e21a058feda442204332aa75d7b67cce914ca4ca99f657134bb4d628",
    Module: "Q29yZQ==",
    "Content-Type": "application/json",
  },
};

(async () => {
  try {
    const response = await axios(options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})();
