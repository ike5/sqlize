// The ADDTAG command needs to be removed. No use
if (commandName === 'addtag') {
    const tagName = interaction.options.getString('name');
    const tagDescription = interaction.options.getString('description');
    try {
      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const tag = await Tags.create({
        name: tagName,
        description: tagDescription,
        username: interaction.user.username,
      });

      return interaction.reply(`Tag ${tag.name} added.`);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return interaction.reply('That tag already exists.');
      }

      return interaction.reply('Something went wrong with adding a tag.');
    }
}

else if (commandName === 'tag') {
    const tagName = interaction.options.getString('name');

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });

    if (tag) {
      // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      tag.increment('usage_count');

      return interaction.reply(tag.get('description'));
    }

    return interaction.reply(`Could not find tag: ${tagName}`);
  } else if (commandName === 'edittag') {
    const tagName = interaction.options.getString('name');
    const tagDescription = interaction.options.getString('description');

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Tags.update(
      { description: tagDescription },
      { where: { name: tagName } }
    );

    if (affectedRows > 0) {
      return interaction.reply(`Tag ${tagName} was edited.`);
    }

    return interaction.reply(`Could not find a tag with name ${tagName}.`);
  } else if (commandName === 'taginfo') {
    const tagName = interaction.options.getString('name');

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });

    if (tag) {
      return interaction.reply(
        `${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
      );
    }

    return interaction.reply(`Could not find tag: ${tagName}`);
  } else if (commandName === 'showtags') {
    //DEPRECATED
    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map((t) => t.name).join(', ') || 'No tags set.';

    return interaction.reply(`List of tags: ${tagString}`);
  } else if (commandName === 'deletetag') {
        // DEPRECATED, please remove
        const tagName = interaction.options.getString('name');
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });
    
        if (!rowCount) return interaction.reply("That tag doesn't exist.");
    
        return interaction.reply('Tag deleted.');
  }