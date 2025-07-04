const { sequelize, User } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [results] = await sequelize.query(
      'SELECT privilege FROM user_privileges WHERE user_id = ?',
      { replacements: [user.id] }
    );

    const privileges = results.map(row => row.privilege);

    res.json({ ...user.toJSON(), privileges });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createUsers = async (req, res) => {
    const { username, password, role, privileges = [] } = req.body;
    const t = await sequelize.transaction();

    try {
        const newUser = await User.create({
            username,
            password,
            role: role || 'user'
        }, { transaction: t });

        for (const priv of privileges) {
            await sequelize.query(
                'insert into user_privileges (user_id, privilege) values (?, ?)',
                {
                    replacements: [newUser.id, priv],
                    transaction: t
                }
            );
        }

        const privilegeList = privileges.join(', ') || 'select';
        
        await sequelize.query(
            `create user '${username}'@'localhost' identified by '${password}'`,
            { transaction: t }
        );

        await sequelize.query(
            `grant ${privilegeList} on ${process.env.DB_NAME}.* to '${username}'@'localhost'`,
            { transaction: t }
        );

        await t.commit();

        res.status(201).json({
            message: 'User created with privileges',
            user: newUser, 
            privileges
        });
    } catch (err) {
        console.error('Error creating user: ', err);
        res.status(500).json({ error: 'Failed to create user' });  
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, role, privileges = [] } = req.body;
    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const oldUsername = user.username;

        await sequelize.query(
            `revoke all privileges on ${process.env.DB_NAME}.* from '${oldUsername}'@'localhost'`,
            { transaction: t }
        );

        user.username = username || user.username;
        user.password = password || user.password;
        user.role = role || user.role;
        await user.save({ transaction: t });

        if (password) {
            await sequelize.query(
                `alter user '${user.username}'@'localhost' identified by '${password}'`,
                { transaction: t }
            );
        }

        const privilegeList = privileges.join(', ') || 'select';

        await sequelize.query(
            `grant ${privilegeList} on ${process.env.DB_NAME}.* to '${user.username}'@'localhost'`,
            { transaction: t }
        );

        await sequelize.query(
            'delete from user_privileges where user_id = ?',
            { replacements: [user.id], transaction: t }
        );

        for (const priv of privileges) {
            await sequelize.query(
                'insert into user_privileges (user_id, privilege) values (?, ?)',
                { replacements: [user.id, priv], transaction: t }
            );
        }

        await t.commit();

        res.json({
            message: 'User and privileges updated successfully',
            user,
            privileges,
        });
    } catch (err) {
        await t.rollback();
        console.error('Error updating user: ', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = { 
    getAllUsers,
    getUserById,
    createUsers,
    updateUser
};