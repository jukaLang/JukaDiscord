require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 

const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const app = express();

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});


app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'hi'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Hi ${interaction.member.user.username}!`,
        },
      });
    }

    if(interaction.data.name == "juka"){
      const input = interaction.data.options[0].value;
      return await (async () => {
        let jukaResponse = await axios('https://api.jukalang.com/'+input);
        return await res.send({
          type: 4,
          data: {
            content: `Output: ${jukaResponse.json()['output']}`,
          },
        });
    })();
    }

    /*if(interaction.data.name == 'dm'){
      // https://discord.com/developers/docs/resources/user#create-dm
      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: interaction.member.user.id
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'Cannot respond to Dash Commands!',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }*/
  }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "hi",
      "description": "replies with Hi!",
      "options": []
    },
    {
      "name": "juka",
      "description": "executes Juka code",
      "options": [{
        "name": "code",
        // Short description of subcommand
        "description": "Code Input",
        // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
        "type": 3,
        // Whether the subcommand is required
        "required": true
    }]
    },
    /*{
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    }*/
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Visit https://jukalang.com')
})


app.listen(8999, () => {

})