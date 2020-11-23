const axios = require('axios');

module.exports = {
  name: 'kanye',
  description: 'Get a random Kanye West quote',
  execute(msg) {
    axios.get('https://api.kanye.rest/')
    .then(res => {
      msg.channel.send(`${res.data.quote} \n- Kanye West`);
    })
    .catch(e => console.log(e));
  },
};