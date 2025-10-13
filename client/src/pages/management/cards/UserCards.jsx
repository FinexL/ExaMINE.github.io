import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import api from "../../../api/axios";
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const UserCard = ({ user, currentUser, onEdit, onStatusChange }) => {
  const handleStatusToggle = async () => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(
        `/users/${user.user_id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (onStatusChange) onStatusChange(user.user_id, newStatus);
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || `Failed to update user status`);
    }
  };

  const isSelf = currentUser?.user_id === user.user_id;
  const isAdmin = user.role === "Admin";

  return (
    <Card
      sx={{
        width: 280,
        height: 260,
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "background.default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6" noWrap fontWeight={600} color="text.secondary">
          {user.username} {isSelf ? "(You)" : isAdmin ? "(Admin)" : ""}
        </Typography>
      </Box>

      {/* User Info */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user.email}
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Role:
          </Typography>
          <Chip
            label={user.role}
            size="small"
            sx={{
              bgcolor: isAdmin ? "tertiary.main" : "grey.300",
              color: isAdmin ? "#fff" : "#000",
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Status:
          </Typography>
          <Chip
            label={user.status}
            color={user.status === "Active" ? "success" : "error"}
            size="small"
          />
        </Box>
      </CardContent>

      {/* Bottom Buttons */}
      <CardActions
        sx={{
          px: 2,
          py: 1.5,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          justifyContent: "space-between",
        }}
      >
        <Button
          startIcon={<EditIcon />}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onEdit(user)}
        >
          {isSelf ? "Edit Profile" : "Edit"}
        </Button>

        {!isSelf &&
          (user.status === "Active" ? (
            <Button
              startIcon={<BlockIcon />}
              size="small"
              variant="outlined"
              color="error"
              onClick={handleStatusToggle}
            >
              Disable
            </Button>
          ) : (
            <Button
              startIcon={<CheckCircleIcon />}
              size="small"
              variant="outlined"
              color="success"
              onClick={handleStatusToggle}
            >
              Activate
            </Button>
          ))}
      </CardActions>
    </Card>
  );
};

export default UserCard;
