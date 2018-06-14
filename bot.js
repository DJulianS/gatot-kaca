const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const request = require("request");
const superagent = require("superagent");
const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;
const weather = require('weather-js');
const dateformat = require('dateformat');
const dateFormat = require('dateformat');
const prefixes = require('./prefixes.json');
const datediff = require('date-diff');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fs = require('fs');
const figlet = require('figlet');
const funnyWords = require('funny-words');
let coins = require("./coins.json");
const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible"
};

const bot = new Discord.Client({disableEveryone: false});

bot.on("ready", async () => {
  console.log(`${bot.user.username} SUDAH SIAP PAK!`);
  bot.user.setUsername('GatotKaca');

        bot.user.setActivity("Muscle Of IRON, Bone Of STEEL!", {type: 'PLAYING'});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}roles`){
    let roles = message.guild.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `${role.name}`).join(" , ")

    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.guild} Roles`, message.guild.iconURL)
    .addField("Roles", `**${roles}**`)

    message.channel.send(embed)
  }

  if(cmd === `${prefix}partners`){
    let embed = new Discord.RichEmbed()
    .addField("Galaxy's Partners list", "**Want to be my partner?** you can just DM my creator xPiu#9355 :D")
    .addField("Ms Official Bot Arena", `[Link](https://discord.gg/GkYM7E)`)

    message.channel.send(embed);
  }

  if(cmd === `${prefix}smash`){
      const user = message.mentions.users.first();
  if (!user) {
    var embed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(":x: Include the mention please.")
    message.channel.send({ embed: embed })
  }

  if (user.id === message.author.id) return message.channel.send("Why you want to smash yourself?")
  if (user.id === bot.user.id) return message.channel.send("Really? You want smash a bot??")
    let newembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("SMASSSHHHUU", `**${message.author.username}** HAS SMASHED **${user.username}**!`)
    .setImage(`https://cdn.discordapp.com/attachments/430295048903720960/437168717848117248/giphy.gif`)

    message.channel.send(newembed);
}

  if(cmd === `${prefix}servernick`){
    let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (!member) {
return message.channel.send(message.member.nickname)
}
message.channel.send(member.nickname); //Note : let membernya harus ada di paling atas
    return;
  }

  if(cmd === `${prefix}ascii`){
     const text = args.join(" ");
    figlet(text, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    if (data.length > 2000) return message.channel.send("That is WAYYYY to long! You may wanna shorten up the word!")
    message.channel.send(`\`\`\`\n${data}\n\`\`\``)
});
}

  if(cmd === `${prefix}creator`) {
    let creatorembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle("Creator!")
    .addField("Created By xPiu9355 And Helped By Another Friends.", "Have Any Issue? DM xPiu#9355 Now!.")

     message.channel.send(creatorembed)
  }

   if (message.content === `<@${bot.user.id}>`) {
       message.channel.send(`👋 Hi <@${message.author.id}>!, My default Prefix is g;`);
   }

  if(cmd === `${prefix}help` || cmd === `${prefix}h`){
    let commandembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle(":question: Help! Default Prefix = g;")
    .addField(":gear: Moderation", "`kick` `ban` `mute` `unmute` `report` `prune/clear` `say`")
    .addField(":circus_tent: General", "`invite` `afk` `ping` `avatar` `roles` `news` `poll` `math`")
    .addField(":information_source: Info", "`serverinfo` `botinfo` `userinfo` `creator` `channelinfo` `emojilist` `botstatus` `tchannel/vchannel`")
    .addField(":video_game: Fun", "`rock/paper/scissors` `cat` `dog(in progress)` `flip` `smash` `achievement`")
    .setFooter("If you have any issue or sugestion please DM xPiu#9355")

    message.react("😉")
    return message.author.send(commandembed).then(message.channel.send("Check DMs :D"));
  }

  if(cmd === `${prefix}kick`){
    message.delete()
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send(message.author +" Who Want Got Kicked?");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(username + ":x: You Can't Do That");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(username + "Can't Get Kicked!");
    let kickEmbed = new Discord.RichEmbed()
    .setTitle("Kicked!")
    .setColor("RANDOM")
    .addField("Kicked User", `${kUser}`)
    .addField("Kicked By", `<@${message.author.id}>`)
    .addField("Kicked in", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", kReason);

    let modlog = message.guild.channels.find(`name`, "mod-logs");
    if(!modlog) return message.channel.send(":thumbsdown: Couldn't Find mod-logs channel.");

    message.guild.member(kUser).kick(kReason);
    modlog.send(kickEmbed);

    return;
  }

  if(cmd === `${prefix}ban`){
     message.delete()
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send(message.author + " Who Want Get Rekted?");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(username + ":x: You Can't Do It!");
    if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send(username + "Can't Get Rekted!");

    let banEmbed = new Discord.RichEmbed()
    .setTitle("Get Rekted!")
    .setColor("RANDOM")
    .addField("Banned User", `${bUser}`)
    .addField("Banned By", `<@${message.author.id}>`)
    .addField("Banned in", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let modlog = message.guild.channels.find(`name`, "mod-logs");
    if(!modlog) return message.channel.send(":thumbsdown: Couldn't Find mod-logs channel.");

    message.guild.ban(bUser).ban(bReason);
    modlog.send(banEmbed);

    return;
  }

  if (cmd === `${prefix}unmute`){
    let UnMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!UnMute) return message.channel.send("Couldn't find user!");
    let role = message.guild.roles.find(r => r.name === "Muted");
    let unReason = args.join(" ").slice(22);

    UnMute.removeRole(role)

    message.channel.sendMessage(UnMute + " Has Been Unmuted. Reason » " + unReason);

    return;
  }

  if (cmd === `${prefix}mute`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage(":x: You Can't Do It!");

      let mtReason = args.join(" ").slice(22);

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.channel.sendMessage("Couldn't find user!.");

    let role = message.guild.roles.find(r => r.name === "Muted");
    if(!role) {
        try {
            role = await message.guild.createRole({
                name: "Muted",
                color: "000000",
                permissions: []
            });

            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch(e) {
            console.log(e.stack);
        }
    }

    if(toMute.roles.has(role.id)) return message.channel.sendMessage("This user is already muted!");
    await toMute.addRole(role);
            message.channel.sendMessage(toMute + " Has Been Muted Because :  " + mtReason);
            message.adminlog.sendMessage(toMute + " Has Been Muted Because  : " + mtReason)

            return;
          }

          if(cmd === `${prefix}ping`){
                 let pingembed = new Discord.RichEmbed()
                 .setColor("RANDOM")
                 .addField(":ping_pong: **Pong!**", + message.client.ping + " ms")
                 return message.channel.send(pingembed);
               }

              if(cmd === `${prefix}say`){
               const sayMessage = args.join(" ");
               message.delete().catch();
               message.channel.send(sayMessage);
                return;
            }

           if(cmd === `${prefix}news`){
             message.delete()
            const sayMessage = args.join(" ");
            let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .addField(":newspaper: **News!**", `**${sayMessage}**`)

            message.channel.send(embed);
            return;
           }

           if(cmd === `${prefix}report`){

               let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
               if(!rUser) return message.channel.send("Couldn't find user.");
               let reason = args.join(" ").slice(22);

               let reportEmbed = new Discord.RichEmbed()
               .setDescription("REPORTS!")
               .setColor("RANDOM")
               .addField("User Reported", `${rUser}`)
               .addField("Reported By", `${message.author}`)
               .addField("In Channel", message.channel)
               .addField("At Time", message.createdAt)
               .addField("With Reason", reason);

               let reportschannel = message.guild.channels.find(`name`, `mod-logs`);
               if(!reportschannel) return message.channel.send(":thumbsdown: Couldn't find mod-logs channel.")


               message.delete().catch(O_o=>{});
               reportschannel.send(reportEmbed)

               //message.delete().catch(O_o=>{});

                return;
             }

             if(cmd === `${prefix}prune` || cmd === `${prefix}clear`){
        message.delete()
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":x: You Can't Do It!");
        if(!args[0]) return message.channel.send("Please Put The Correct Number To Cleared");
        message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`${message.author}, ${args[0]} Message That You Want To Clear, I Have Clear It. Have Fun! :)`).then(msg => msg.delete(999999));
        })
      }

    if (cmd === `${prefix}ask`){
      if(args[100]) return message.reply("Please Ask A Full Question (3 Sentences)");
      let replies = ["Yes", "No", "I Think Yes", "I Don't Know", "What Are You Saying?", "Hmm", "Oh.."];

      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(1).join(" ");

      message.channel.send(`:thinking: | **${replies[result]}**`)

    }

    if (cmd === `${prefix}rock`){
      if(args[100]) return message.reply("Please Ask A Full Question (3 Sentences)");
      let replies = [":full_moon: | Rock! Ahh, We Same Bro!", ":page_with_curl: | Paper! Yes, I Win!", ":scissors:  | Scissors! Huft, Im Lose!"]
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(1).join(" ");

      message.channel.send(`Rock Paper Scissor!  **${replies[result]}**`)

    }

     if (cmd === `${prefix}paper`){
      if(args[100]) return message.reply("Please Ask A Full Question (3 Sentences)");
      let replies = [":full_moon: | Rock! Huft, Im Lose!", ":page_with_curl: | Paper! Ahh, We Same Bro!", ":scissors:  | Scissors! Yes, I Win!"]
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(1).join(" ");

      message.channel.send(`Rock Paper Scissor!  **${replies[result]}**`)

    }

 if (cmd === `${prefix}scissors`){
      if(args[100]) return message.reply("Please Ask A Full Question (3 Sentences)");
      let replies = [":full_moon: | Rock! Yes, I Win!", ":page_with_curl: | Paper! Huft, Im Lose!", ":scissors:  | Scissors! Ahh, We Same Bro!"]
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(1).join(" ");

      message.channel.send(`Rock Paper Scissor!  **${replies[result]}**`)

    }

  if(cmd === `${prefix}avatar`){
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    let avatarembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(member.user.tag)
    .setImage(member.user.displayAvatarURL);

     message.channel.send(avatarembed);
    return;
  }

  if(cmd === `${prefix}servav`){
    let serveravatar = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`${message.guild.name} avatar's `)
    .setImage(message.guild.iconURL);

    message.channel.send(serveravatar);
    return;
  }

  if(cmd === `${prefix}invite`){
    let inviteembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Discord Bot Link", "[Coming Soon!]")
    .addField("Discord Official Link", "[Coming Soon!]")

    message.react("😉")
    message.channel.send(inviteembed);
    return;
  }

  if(cmd === `${prefix}afk`){
      let afkuser = args.join(" ").slice(0);

      message.react("👌")
      message.guild.members.get(message.author.id).setNickname("-AFK- " + message.author.username);
      message.channel.send(`${message.author} Was Afking For: ` + afkuser)

       return;
    }

 if(message.content === `Hi!`){
  message.channel.send(`👋 Hi Too ${message.author} ! :)`)
 }

if(cmd === `${prefix}servers`) {

    var authors = ["323807884863471618"];
    if(!authors.includes(message.author.id)) {
    const guilds = bot.guilds.map(g=>`${g.name} - ${g.owner.user.username} - ${g.members.size} users - ${g.channels.size} channels`).slice(0, 15).join('\n')
    const guilds2 = bot.guilds.map(g=>`${g.name} - ${g.owner.user.username} - ${g.members.size} users - ${g.channels.size} channels`).slice(16, 31).join('\n')
    const guilds3 = bot.guilds.map(g=>`${g.name} - ${g.owner.user.tag} - ${g.members.size} users - ${g.channels.size} channels`).slice(32, 45).join('\n')
    message.author.send(`= Galaxy's Servers Part 1 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n ${guilds}`, {code:'asciidoc'});
    message.author.send(`= Galaxy's Servers Part 2 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n ${guilds2}`, {code:'asciidoc'});
    message.author.send(`= Galaxy's Servers Part 3 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n ${guilds3}`, {code:'asciidoc'});
    message.channel.send({
            embed: {
                color: RANDOM,
                description: "📬 I have send you the Server list, Check DM Please!"
            }
        })
    } else {
      const guilds = bot.guilds.map(g=>`${g.name} - ${g.owner.user.tag} - ${g.members.size} users - ${g.channels.size} channels`).slice(0, 15).join('\n')
      const guilds2 = bot.guilds.map(g=>`${g.name} - ${g.owner.user.tag} - ${g.members.size} users - ${g.channels.size} channels`).slice(16, 31).join('\n')
      const guilds3 = bot.guilds.map(g=>`${g.name} - ${g.owner.user.tag} - ${g.members.size} users - ${g.channels.size} channels`).slice(32, 45).join('\n')
    message.author.send(`= Galaxy's Servers Part 1 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n${guilds}`, {code:'asciidoc'});
    message.author.send(`= Galaxy's Servers Part 2 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n${guilds2}`, {code:'asciidoc'});
    message.author.send(`= Galaxy's Servers Part 3 =\n [Guild Name - Guild Owner - Guild Member Size - Guild Channels Size] \n \n${guilds3}`, {code:'asciidoc'});
    message.channel.send({
            embed: {
                color: RANDOM,
                description: "📬 I have send you the Server list, Check DM Please!"
            }
        })
    }}


if(cmd === `${prefix}cat`){

    let member = message.member;

    let {body} = await superagent
    .get(`http://aws.random.cat/meow`);

    let catembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle(":cat: This is about Cat that i found")
    .setTimestamp()
    .setFooter(`Have Any Issue? DM Azem#9355 Now!.`)
    .setImage(body.file);

    message.channel.send(catembed);
    return;
}

if(cmd === `${prefix}dog`){

    let member = message.member;

    let {body} = await superagent
    .get(`https://random.dog/woof.json`);

    let dogembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setTitle(":dog: This is about Dog that i found")
    .setTimestamp()
    .setFooter(`Have Any Issue? DM Azem#9355 Now!.`)
    .setImage(body.url);

    message.channel.send(dogembed);
    return;
}

if(cmd === `${prefix}channelinfo`){
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .addField("Name", message.channel.name)
  .addField("Type", message.channel.type)
  .addField("ID ", message.channel.id)
  .addField("Created At", message.channel.createdAt)

  return message.channel.send(embed);
}

if(cmd === `${prefix}poll`){
  const questions = message.content.split(' ').slice(1).join(' ');
    if (!questions) return message.channel.send("Don't leave it blank please!");
    if (!message.content.includes("|")) {
        message.channel.send("Give **|** to me so i can make the poll.");
        return;
    }

    const choiceOne = message.content.substring(8, message.content.indexOf(" | "));
    const choiceTwo = message.content.split('|').slice(1).join(" ");

    let firstChoice = choiceOne;
    let secondChoice = choiceTwo;

    if (questions.length < 2) {
        return message.channel.send("Make the true poll please!");
    }

    if (!firstChoice) {
        return message.channel.send("Put the first choice!");
    }

    if (!secondChoice) {
        return message.channel.send("Put the second choice!");
    }

    if (questions[0].includes("|")) {
        return message.channel.send("Put the first choice!");
    }

    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setFooter(`Poll maked by ${message.author.tag}`, message.author.avatarURL)
    .addField("1st Choice", firstChoice, true)
    .addField("2nd Choice", secondChoice, true)
    message.channel.send({embed: embed})
    .then(msg => {
        msg.react(':one:')
        .then(msg.react(":two:"));

    });


}

if(cmd === `${prefix}flip`){
    const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
      const OFFSET = '!'.charCodeAt(0);
       const args = message.content.split(' ').slice(1)
    if (args.length < 1) {
        message.channel.send('Please put the text that you want to flip.');
    }

    message.channel.send(
        args.join(' ').split('')
            .map(c => c.charCodeAt(0) - OFFSET)
            .map(c => mapping[c] || ' ')
            .reverse().join('')
    );
}

if(cmd === `${prefix}serverinfo`){

    const now = new Date();
         dateFormat(now, '***On dddd, mmmm dS, yyyy, h:MM:ss TT***');

  let region = {
    "brazil": "**Brazil** :flag_br:",
    "eu-central": "**Central Europe** :flag_eu:",
        "singapore": "**Singapore** :flag_sg:",
        "us-central": "**U.S. Central** :flag_us:",
        "sydney": "**Sydney** :flag_au:",
        "us-east": "**U.S. East** :flag_us:",
        "us-south": "**U.S. South** :flag_us:",
        "us-west": "**U.S. West** :flag_us:",
        "eu-west": "**Western Europe** :flag_eu:",
        "singapore": "**Singapore** :flag_sg:",
        "london": "**London** :flag_gb:",
        "japan": "**Japan** :flag_jp:",
        "russia": "**Russia** :flag_ru:",
        "hongkong": "**Hong Kong** :flag_hk:"
  }
  let icon;
  if (message.guild.iconURL) {
      icon = message.guild.iconURL
  }
  if (!message.guild.iconURL) {
      icon = "https://cdn.discordapp.com/attachments/435462380810403851/435730430436573185/black.png"
  }
  let owner = message.guild.owner.user
  if (!owner) {
      owner = "None for some reason..."
  };

    const millis = new Date().getTime() - message.guild.createdAt.getTime();
    const days = millis / 1000 / 60 / 60 / 24;



    const verificationLevels = ['**None**', '**Low**', '**Medium**', '**(╯°□°）╯︵ ┻━┻** (High)', '**┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻** (Extreme)'];
   const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

 var embed = new Discord.RichEmbed()
    .setTitle(`**Server info for ${message.guild.name}** :computer:`)
    .setColor("RANDOM")
    .setThumbnail(icon)
    .addField("Guild ID", `**___${message.guild.id}___**`, true)
    .addField("Created On", `**${dateFormat(message.guild.createdAt)}**`)
    .addField("Region", `${region[message.guild.region]}`, true)
    .addField("User Count", `**${message.guild.members.filter(m => m.presence.status !== 'offline').size}** Is Online from **${message.guild.memberCount}** members`, true)
    .addField("Owner", `**${message.guild.owner.user.tag}**`, true)
    .addField("Channel", `**${message.guild.channels.filter(m => m.type === 'text').size}** Text Channels \n**${message.guild.channels.filter(m => m.type === 'voice').size}** Voice Channels \n**${message.guild.channels.filter(m => m.type === 'category').size}** Category`, true)
    .addField("Verification Level", `${verificationLevels[message.guild.verificationLevel]}`, true)
    .addField("Roles", `**${message.guild.roles.size}** Roles ___(Do $roles to see all roles!)___`, true)
    message.channel.send({ embed: embed });
}


if(cmd === `${prefix}vchannel`){
      let channels = message.guild.channels.filter(m => m.type === 'voice').map(vc => vc).slice(1).join(" , ")
    if (!channels) channels = "None";

    message.channel.send({
            embed: {
                color: 0x503d82,
                description: `The following Voice Channels on **${message.guild.name}** are:\n\n${channels.length > 1024 ? "\'The roles list is too long to list.\'" : channels}\n \u200B`
            }
        })
}

if(cmd === `${prefix}tchannel`){
      let channels = message.guild.channels.filter(m => m.type === 'text').map(vc => vc).slice(1).join(" , ")
    if (!channels) channels = "None";

    message.channel.send({
            embed: {
                color: 0x503d82,
                description: `The following Text Channels on **${message.guild.name}** are:\n\n${channels.length > 1024 ? "\'The roles list is too long to list.\'" : channels}\n \u200B`
            }
        })
}

if(cmd === `${prefix}category`){
      let channels = message.guild.channels.filter(m => m.type === 'category').map(vc => vc).slice(1).join(" , ")
    if (!channels) channels = "None";

    message.channel.send({
            embed: {
                color: 0x503d82,
                description: `The following Category Channels on **${message.guild.name}** are:\n\n${channels.length > 1024 ? "\'The roles list is too long to list.\'" : channels}\n \u200B`
            }
        })
}

if(cmd === `${prefix}userinfo`){

    let user = message.mentions.users.first() || message.author
let member = message.guild.member(user)
let roles = member.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `<@&${role.id}>`);
let messageauthor = message.guild.member(message.author)
let authorroles = message.guild.member(message.author).roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `<@&${role.id}>`)

let joined = new datediff(Date.now(), member.joinedAt);
let created = new datediff(Date.now(), user.createdAt);

if (roles.length < 1) roles = ['None']
const status = {
   online: 'Online',
   idle: 'Idle',
   dnd: 'Do Not Disturb',
   offline: 'Offline/Invisible'
 };
 let emoji;
 if (user.presence.status === "online") {
     emoji = "<:online:435163118591672343>"
 }
 if (user.presence.status === "dnd") {
     emoji = "<:dnd:435163118444871691>"
 }
 if (user.presence.status === "idle") {
     emoji = "<:away:435163118692335616>"
 }
 if (user.presence.status === "offline") {
     emoji = "<:offline:435163118750924830>"
 }

 let game = user.presence.game && user.presence.game && user.presence.game.name
 if (!game) {
     game = "User is not playing a game."
 }
  let botuser;
  if (member.user.bot === true) botuser = 'Yes, its was a bot'
  else botuser = 'Nope, He/She is not a bot'
  const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

  var authors = ["262410813254402048", "396027480097554432"]
      if (authors.includes(message.author.id && user.id)) {
                var lastmsg = user.lastMessage;
                if (lastmsg === undefined) {
                    lastmsg = "Has not said a message yet"
                }
          let botuser;
  if (member.user.bot === true) botuser = 'Yes'
  else botuser = 'No'
  let embed = new Discord.RichEmbed()
  .setTitle("__Userinfo On The Owners!__ :prince:")
  .setColor("RANDOM")
  .setThumbnail(`${user.displayAvatarURL}`)
  .addField("*Username* :name_badge:", `_${user.tag}_`)
  .addField("*ID* :id:", `_${user.id}_`)
  .addField("*Created Account On* 🖥", `_${dateformat(user.createdAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}, that is ${Math.round(created.days())} days ago!`)
  .addField(`*Status* ${emoji}`, `_${status[user.presence.status]}_`, true)
  .addField("*Last Message* :speech_left:", `_${lastmsg}_`, true)
  .addField(`*Joined ${message.guild.name} On* 📲`, `_${dateformat(member.joinedAt, "***mmmm dS, yyyy***, On a ***dddd***, ***h:MM:ss TT, Z***")}, that is ${Math.round(joined.days())} days ago!`, true)
  .addField("*Playing* :video_game:", `_${game}_`, true)
  .addField("*Roles* 📃", `*${roles.join(', ')}*`, true)
  .addField("*Bot?* :robot:", `_${botuser}_`, true)
  message.channel.send({ embed: embed })
  return;
    }

  if (!user) {


let embed = new Discord.RichEmbed()
.setTitle("**__Userinfo__**")
  .setColor(randomColor)
  .setThumbnail(`${message.author.displayAvatarURL}`)
  .addField("*Username* :name_badge:", `***>***__${message.author.tag}__`)
  .addField("*ID* :id:", `***>***__${message.author.id}__`, true)
  .addField("*Created At* <:added:394910274177597491>", `***>***${message.author.createdAt}`)
  .addField(`*Joined __${message.guild.name}__ On*** <:added_user:393802707267354645>`, `***>***__${messageauthor.joinedAt}__`)
  .addField("Status", `${status[message.author.presence.status]}`, true)
  .addField("Last Message", `${(lastmsg) || 'Has not said a message yet.'}`, true)
  .addField("Playing", `${(message.author.presence.game && message.author.presence.game && message.author.presence.game.name) || 'Not playing a game.'}`, true)
  .addField("Nickname", `${message.member.displayName}`, true)
  .addField("Roles", `${roles.join(', ')}`, true)
  .addField("Bot?", `${botuser}`, true)
  .addField("Wait", "Why is t")
message.channel.send({embed});
} else {
                    var lastmsg = user.lastMessage;
                if (lastmsg === undefined || lastmsg === null) {
                    lastmsg = "Has not said a message yet"
                }
  let botuser;
  if (member.user.bot === true) botuser = 'Yes, Its is a bot'
  else botuser = 'No, He/She is not a bot'
  let embed = new Discord.RichEmbed()
  .setColor(randomColor)
  .setThumbnail(`${user.displayAvatarURL}`)
  .addField("Username :name_badge:", `${user.tag}`)
  .addField("ID", `**___${user.id}___**`)
  .addField("Created Account On ", `${dateformat(user.createdAt, "***mmmm dS, yyyy***, On  ***dddd***, ***h:MM:ss TT, Z***")}, Woah, that was ${Math.round(created.days())} days ago!`)
  .addField(`Status`, `${emoji}` + `_${status[user.presence.status]}_`, true)
  .addField(`Joined ${message.guild.name} On`, `${dateformat(member.joinedAt, "***mmmm dS, yyyy***, On ***dddd***, ***h:MM:ss TT, Z***")}, Woah, that was ${Math.round(joined.days())} days ago!`, true)
  .addField("Playing", `___${game}___`, true)
  .addField("Roles", `${roles.join(', ')}`, true)
  .addField("Bot?", `**${botuser}**`, true)
message.channel.send({embed});
    }
}

if(cmd === `${prefix}botinfo`){
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setThumbnail(`${bot.user.displayAvatarURL}`)
  .addField("Bot Username", `**${bot.user.username}**`, true)
  .addField("ID", `***__${bot.user.id}__***`, true)
  .addField("Created On ", `**${bot.user.createdAt}**`, true)
  .addField("Developer", `**Azem#9355** And Another Friends.`)
  .addField("Official Discord Server", `___[Coming Soon!]___`)
  .addField("Servers", `**${bot.guilds.size}** server that i joined`, true)
  .addField("Total Users", `**${bot.users.size}** users from **${bot.guilds.size}** servers`, true)
  .addField("Total Channels", `**${bot.channels.size}** channels from **${bot.guilds.size}** servers`, true)

  message.channel.send(embed);
}

if(cmd === `${prefix}achievement`){
   var ids = [
            "20",
            "1",
            "13",
            "18",
            "17",
            "9",
            "31",
            "22",
            "23",
            "2",
            "11",
            "19",
            "24",
            "25",
            "12",
            "33"
            ]
            const randomizer = Math.floor(Math.random()*ids.length);
            const args = message.content.split(" ").slice(1).join(" ")
    if (!args) return message.channel.send("Put something that you want to achievement!");
    const image = new Discord.Attachment(`https://www.minecraftskinstealer.com/achievement/a.php?i=${ids[randomizer]}&h=Achievement Get!&t=${args}`, "achievement.png");
message.channel.send(image)
    }

if(cmd === `${prefix}emojilist`){
  const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
  if (!emojiList) return message.reply("This server doesn't have any emojis!")
  let embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .addField("Emoji List", `${emojiList}`)

message.channel.send(embed);
}

if(cmd === `${prefix}math`){
    const args = message.content.split(" ").slice(1).join(" ")
    if (args.length < 1) {
        message.channel.send('You must put number to be solved on the calculator')
        return;
    }


    let answer;
    try {
        answer = math.eval(args);
    } catch (err) {
       var embed = new Discord.RichEmbed()
       .setTitle("Math Failed!")
       .setColor(0xba3d2a)
       .setThumbnail("https://cdn.discordapp.com/attachments/431445877102739466/434223694764572693/12065738771352376078Arnoud999_Right_or_wrong_5.png")
       .addField("You put the wrong calculation!", `You can't calculate ${args}`)
       .addField("Key:", "```md\n <Addition: +> \n <Subtraction: -> \n <Multiplication: *> \n <Division: /> \n <PEMDAS: (1+1)x1> \n```")
       message.channel.send({ embed: embed })
        return;
    };
  const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    message.delete();
    var embed2 = new Discord.RichEmbed()
    .setTitle("Calculating..")
    .setColor(randomColor)
    .setThumbnail("https://cdn.discordapp.com/attachments/431445877102739466/434222367816810499/Calculator.png")
    .addField("I've sucessfuly calculated:", `${args}`)
    .addField("The result is:", `${answer}`)
    message.channel.send({ embed: embed2 })

    }

if(cmd === `${prefix}botstatus`){
  let embed = new Discord.RichEmbed()
  .setColor("#ffffff")
  .addField("Guild", bot.guilds.size + " Guilds")
  .addField("Users", bot.users.size.toLocaleString() + " Users")

  return message.channel.send(embed);
}
});
bot.login('process.env.BOT_TOKEN');
