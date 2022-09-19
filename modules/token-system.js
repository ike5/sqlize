/**
 * This module helps with adding tokens
 */

// Set the name and the value of tokens
const awards = {
  "Bronze Fountain Pen": 5,
  "Copper Fountain Pen": 5,
  "Silver Fountain Pen": 5,
  "Crystal Fountain Pen": 5,
  "Ruby Fountain Pen": 10,
  "Sapphire Fountain Pen": 10,
  "Rose Gold Fountain Pen": 15,
  "White Gold Fountain Pen": 15,
  "Platinum Fountain Pen": 20,
  "Diamon Fountain Pen": 20,
};

const levels = {
  "Entrance Exam": 1,
  Disciple: 2,
  Apprentice: 4,
  Scribe: 8,
  Mentor: 16,
  Expert: 32,
  Master: 64,
  Scholar: 128,
  Sage: 256,
};
// If user checks-in, earns 5 tokens
// Key: check_ins, integer

// If user's first time checking-in, earn 5 tokens, then alert user
// Key: first_check_in, boolean

const userData = {
  user: {
    active_hours_studying: 0.0,
    anniversary: "date",
    avatar: [],
    challenges: [],
    check_ins: 0,
    class: {
      class_name: "",
      class_level: 0,
    },
    consecutive_check_ins: 0,
    discord_data: {
      discordId: "",
      username: "",
      discordNickname: "",
      date_joined: "",
    },
    emotes: [],
    friends: [
      {
        set() {
          this.name = "Jon";
        },
        name: "",
        num_times_chat_with: 0,
        time_studied_together: 0,
        num_times_studied_together: 0,
      },
    ],
    golden_ink_drops: 0,
    is_currently_online: false,
    last_checkin_id: "",
    leaderboard_ranking: 0,
    limit_daily_messages: 10,
    personal_info: {
      name: "",
      email_address: "",
      phone_number: "",
      street_address: "",
    },
    privileges: {
      sms: false,
      trade_tokens: false,
      messaging: true,
      moderation: false,
    },
    text_messages_sent_this_month: 0,
    total_checkins: 0,
    total_days: 0,
    total_events_attended: 0,
    total_messages_sent: 0,
    total_helpful_reactions: 0,
    total_positive_reactions: 0,
    total_messages_sent_today: 0,
    total_responses_to_others_messages: 0,
    welcomed_a_newbie: false,
    wgu_class_code: "",
  },
};

module.exports = {
  userData: userData,
};
