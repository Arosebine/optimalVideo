import sequelize from '../../connections/komas.database';
import { DataTypes, UUIDV4 } from 'sequelize';

const Video = sequelize.define('Video', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},{
    sequelize,
    modelName: 'Video',
    tableName: 'videos',
    timestamps: true,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    underscoredAll: true
});

Video.sync({ }).then(() => console.log('Video table created'));

export default Video;
