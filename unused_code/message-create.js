/**
 * Currently not in use
 */
 client.on('messageCreate', async (message) => {
    if (message.author.bot) {
      console.log('a bot');
    } else {
      console.log('not a bot');
    }
  
    if (message.content === '!online') {
      let allMembers = await message.guild.members.fetch();
      let onlineUsers = allMembers.filter((member) => member.presence);
  
      let mOnlineUsers = onlineUsers.map((m) => {
        return {
          status: m.presence.status,
          name: m.user.username,
        };
      });
  
      let online = 'status\t\tusername\n-------\t\t-----------\n';
      mOnlineUsers.forEach((element) => {
        online += `${element.status}\t\t${element.name}\n`;
      });
      message.reply(online);
    }
  
    // Lists all users who've made checkins
    if (message.content === '!allusers') {
      let registeredUsers = 'Registered users:\n';
  
      const u = await User.findAll({
        attributes: ['username'],
      });
  
      u.forEach((element) => {
        registeredUsers += `${element.username}\n`;
      });
  
      await message.reply({ content: `${registeredUsers}` });
    }
  });
  