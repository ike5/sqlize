/**
 * This module helps with adding tokens
 */

// Set the name and the value of tokens
const awards = new Map();
awards.set('Bronze Fountain Pen', 5);
awards.set('Copper Fountain Pen', 5);
awards.set('Silver Fountain Pen', 5);
awards.set('Crystal Fountain Pen', 5);
awards.set('Ruby Fountain Pen', 10);
awards.set('Sapphire Fountain Pen', 10);
awards.set('Rose Gold Fountain Pen', 15);
awards.set('White Gold Fountain Pen', 15);
awards.set('Platinum Fountain Pen', 20);
awards.set('Diamon Fountain Pen', 20);

const levels = new Map();
levels.set('Entrance Exam', 1);
levels.set('Disciple', 2);
levels.set('Apprentice', 4);
levels.set('Scribe', 8);
levels.set('Mentor', 16);
levels.set('Expert', 32);
levels.set('Master', 64);
levels.set('Scholar', 128);
levels.set('Sage', 256);

// If user checks-in, earns 5 tokens
// Key: check_ins, integer

// If user's first time checking-in, earn 5 tokens, then alert user
// Key: first_check_in, boolean

const userData = {
  user: {
    active_hours_studying: 0.0,
    anniversary: 'date',
    avatar: [],
    challenges: [],
    check_ins: 0,
    class: {
      class_name: '',
      class_level: 0,
    },
    consecutive_check_ins: 0,
    emotes: [],
    friends: [
        {
            name: '',
            num_times_chat_with: 0,
            time_studied_together: 0,
            num_times_studied_together: 0,
        },
    ],
    golden_ink_drops: 0,
    is_currently_online: false,
    last_checkin_id: '',
    leaderboard_ranking: 0,
    limit_daily_messages: 10,
    personal_info: {
        name: '',
        email_address: '',
        phone_number: '',
        street_address: '',
    },
    privileges: {
        sms: false,
        trade_tokens: false,
        messaging: true,
        moderation: false,
    },
    text_messages_sent_this_month: 0,
    total_days: 0,
    total_events_attended: 0,
    total_messages_sent: 0,
    total_helpful_reactions: 0,
    total_positive_reactions: 0,
    total_messages_sent_today: 0,
    total_responses_to_others_messages: 0,
    welcomed_a_newbie: false,
    wgu_class_code: '',
  },
};
