module.exports = {
    SOCKET_NEW_CONNECTION: 'new_connection',
    SOCKET_ADD_PLAYER: 'new_player',
    SOCKET_SEND_ID: 'send_socket_id',
    SOCKET_ADD_PLAYER_ERROR: 'failed_adding_player',
    SOCKET_CONFIRM_PLAYER_ADDED: 'new_player_confirmed',
    SOCKET_SEND_HAND: 'send_full_hand',
    SOCKET_SEND_HAND_ERROR: 'failed_sending_full_hand',
    SOCKET_SEND_HAND_CONFIRM: 'send_full_hand_confirm_received',
    SOCKET_START_ROUND_AS_PLAYER: 'start_new_round_as_player',
    SOCKET_START_ROUND_AS_JUDGE: 'start_new_round_as_judge',
    SOCKET_SEND_ROUND_SUBMISSION: 'send_round_submission',
    SOCKET_SEND_CARD: 'send_new_card',
    SOCKET_SEND_CARD_CONFIRM: 'send_new_card_confirm_received',
    SOCKET_SEND_JUDGE_CAN_CONTINUE: 'all_entries_submitted_can_continue',
    SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE: 'judge_says_can_continue',
    SOCKET_SEND_OPTIONS_TO_PLAYERS: 'send_options_for_vote',
}