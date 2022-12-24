import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    const friends = await Promise.all(user.friends.map((id) => User.findById(id).select('-password')));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json({
      data: formattedFriends,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return res.status(500).json({
        message: 'Oopss..., Something went wrong',
      });
    }

    const user = await User.findById(id).select('-password');
    const friend = await User.findById(friendId).select('-password');

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((friendId) => friendId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map((id) => User.findById(id).select('-password')));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json({
      data: formattedFriends,
      message: 'Friends successfully updated!',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
