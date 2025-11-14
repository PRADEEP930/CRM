#!/bin/bash

echo "🚀 Deploying CRM Backend to AWS EC2..."

# Get EC2 public IP (run this on EC2)
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -a -G docker ec2-user

# Create app directory
mkdir -p /home/ec2-user/crm-backend
cd /home/ec2-user/crm-backend

# Copy your backend files here (via git or SCP)
# Or clone your repo
git clone https://github.com/your-username/CRM.git .
cd backend

# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL=postgresql://crm_user:crm_password@postgres:5432/crm_db
JWT_SECRET=your-super-secure-production-jwt-secret-2024
CORS_ORIGIN=https://your-vercel-app.vercel.app
EOF

# Build and start
docker-compose -f docker-compose.aws.yml up -d --build

echo "✅ Backend deployed successfully!"
echo "🔗 Backend URL: http://$EC2_IP:5000"
echo "📊 API Health: http://$EC2_IP:5000/api/health"