import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import Comment from '~/models/Comment';
import {colors, spacing} from '~/theme';
import {Text} from '~/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FirebaseService from '~/services/FirebaseService';
import Toast from 'react-native-toast-message';
import moment from 'moment';

interface CommentDisplayerProps {
  comment: Comment;
  navigation?: any;
  route?: any;
}

const CommentDisplayer: FC<CommentDisplayerProps> = ({comment}) => {
  const [reported, setReported] = useState(false);

  let shownDate;

  try {
    shownDate = new Date(comment.createdAt.toMillis());
  } catch {
    shownDate = new Date(comment.createdAt);
  }

  let date = moment(shownDate).format('L h:mm');

  const reportComment = async () => {
    if (reported) {
      return;
    }
    await FirebaseService.reportComment(comment);
    Toast.show({
      text1: 'Comment Reported',
      text2:
        'Comment has been reported, thanks for making Fenix a better place.',
    });
    setReported(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text variant="body1Bold">
          {comment.senderName} -<Text color={colors.darkGrey}> {date}</Text>
        </Text>
        <Text top="tiny" variant="body2Regular">
          {comment.comment}
        </Text>
      </View>
      <TouchableOpacity onPress={reportComment}>
        <AntDesign name="warning" size={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xMedium,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CommentDisplayer;
