const mongoose = require("mongoose");

const CanvasSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
        default: "Untitled Canvas",
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },
    elements: {
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false,
        index: true
    },
    shared_with: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            canEdit: {
                type: Boolean,
                default: false
            },
            sharedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    settings: {
        backgroundColor: {
            type: String,
            default: "#ffffff"
        },
        gridEnabled: {
            type: Boolean,
            default: false
        },
        gridSize: {
            type: Number,
            default: 20
        }
    }
}, { 
    timestamps: true,
    collection: "canvases"
});

// Indexes for better query performance
CanvasSchema.index({ owner: 1, createdAt: -1 });
CanvasSchema.index({ "shared_with.user": 1, createdAt: -1 });
CanvasSchema.index({ isPublic: 1, createdAt: -1 });

// Static methods
CanvasSchema.statics.findAllByUserId = async function (userId) {
    const canvases = await this.find({
        $or: [
            { owner: userId },
            { "shared_with.user": userId }
        ]
    }).populate('owner', 'name email')
      .populate('shared_with.user', 'name email')
      .sort({ updatedAt: -1 });
    
    return canvases;
};

CanvasSchema.statics.findPublicCanvases = async function (limit = 20, skip = 0) {
    const canvases = await this.find({ isPublic: true })
        .populate('owner', 'name email')
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);
    
    return canvases;
};

CanvasSchema.statics.findByCanvasId = async function (canvasId, userId = null) {
    const query = { _id: canvasId };
    
    // If user is not provided, only return public canvases
    if (!userId) {
        query.isPublic = true;
    } else {
        // Return if user is owner, shared user, or canvas is public
        query.$or = [
            { owner: userId },
            { "shared_with.user": userId },
            { isPublic: true }
        ];
    }
    
    const canvas = await this.findOne(query)
        .populate('owner', 'name email')
        .populate('shared_with.user', 'name email');
    
    return canvas;
};

// Instance methods
CanvasSchema.methods.canUserEdit = function (userId) {
    if (!userId) return false;
    
    // Owner can always edit
    if (this.owner.toString() === userId.toString()) {
        return true;
    }
    
    // Check if user is shared with edit access
    const sharedUser = this.shared_with.find(
        share => share.user.toString() === userId.toString() && share.canEdit
    );
    
    return !!sharedUser;
};

CanvasSchema.methods.canUserView = function (userId) {
    // Public canvases can be viewed by anyone
    if (this.isPublic) return true;
    
    if (!userId) return false;
    
    // Owner can always view
    if (this.owner.toString() === userId.toString()) {
        return true;
    }
    
    // Check if user is shared (with or without edit access)
    const sharedUser = this.shared_with.find(
        share => share.user.toString() === userId.toString()
    );
    
    return !!sharedUser;
};

CanvasSchema.methods.canUserDelete = function (userId) {
    if (!userId) return false;
    
    // Only owner can delete
    return this.owner.toString() === userId.toString();
};

CanvasSchema.methods.addSharedUser = function (userId, canEdit = false) {
    // Check if user is already shared
    const existingShare = this.shared_with.find(
        share => share.user.toString() === userId.toString()
    );
    
    if (existingShare) {
        // Update existing share
        existingShare.canEdit = canEdit;
        existingShare.sharedAt = new Date();
    } else {
        // Add new share
        this.shared_with.push({
            user: userId,
            canEdit,
            sharedAt: new Date()
        });
    }
    
    return this.save();
};

CanvasSchema.methods.removeSharedUser = function (userId) {
    this.shared_with = this.shared_with.filter(
        share => share.user.toString() !== userId.toString()
    );
    
    return this.save();
};

module.exports = mongoose.model("Canvas", CanvasSchema);