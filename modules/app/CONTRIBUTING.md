# Contributing to Foundation OS

Thank you for your interest in contributing to Foundation OS! We're building the world's first AI-driven operating system, and we need your help to make it amazing.

## 🌟 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git and GitHub account
- Basic knowledge of React, TypeScript, and Supabase

### Development Setup
```bash
# Clone the repository
git clone https://github.com/foundation-os/foundation-os.git
cd foundation-os

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 🏗️ Architecture Overview

Foundation OS uses a modern stack:
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build**: Vite for lightning-fast development
- **Database**: Supabase (PostgreSQL + real-time)
- **Deployment**: Vercel for global distribution
- **MCP**: 250+ tools orchestration via MCP protocol

## 🤝 How to Contribute

### 1. Code Contributions

#### Before You Start
1. Check existing issues or create a new one
2. Discuss your approach in the issue comments
3. Fork the repository and create a feature branch

#### Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-amazing-feature

# Make your changes following our guidelines
# Run tests and linting
npm run test
npm run lint

# Commit with conventional commits
git commit -m "feat(component): add amazing feature"

# Push and create PR
git push origin feature/your-amazing-feature
```

#### Code Guidelines
- **MD FIRST**: Always update `.md` files before `.jsx` files
- **Void Glass Design**: Use `#06070C` background, Figtree UI font
- **Component Size**: Keep components under 700 lines
- **TypeScript**: Strict mode, full type coverage
- **Testing**: Write tests for new features

### 2. Documentation Contributions

We love documentation improvements! You can:
- Fix typos and grammar
- Add code examples
- Create tutorials and guides
- Improve API documentation
- Translate documentation

### 3. Community Contributions

Help build our community:
- Answer questions in discussions
- Help newcomers in Discord/Slack
- Share Foundation OS on social media
- Write blog posts about your experience
- Organize local meetups

## 📝 Pull Request Guidelines

### PR Checklist
- [ ] **MD FIRST**: Updated corresponding `.md` files
- [ ] **Conventional Commits**: Used proper commit format
- [ ] **Tests**: Added/updated tests for changes
- [ ] **Documentation**: Updated relevant documentation
- [ ] **TypeScript**: No type errors
- [ ] **Linting**: No linting errors
- [ ] **Performance**: No significant performance regressions

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Existing tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Breaking Changes
List any breaking changes and migration steps
```

## 🎯 Contribution Areas

### High Priority
- MCP tool integrations
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Security enhancements

### Medium Priority
- UI/UX improvements
- Documentation updates
- Test coverage
- Internationalization
- Developer experience

### Community Projects
- Plugin development
- Template creation
- Tutorial writing
- Tool integrations
- Example applications

## 🐛 Bug Reports

Found a bug? Help us fix it!

### Bug Report Template
```markdown
**Describe the bug**
Clear description of what went wrong

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What should have happened

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Foundation OS version: [e.g. v1.2.0]
```

## 💡 Feature Requests

Have an idea? We'd love to hear it!

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
What you want to happen

**Describe alternatives**
Other solutions you've considered

**Additional context**
Screenshots, mockups, or examples
```

## 🏆 Recognition

We believe in recognizing our contributors:

### Contributor Levels
- **First-time**: Welcome to the community!
- **Regular**: 5+ merged PRs
- **Core**: 20+ merged PRs + ongoing contributions
- **Maintainer**: Leadership in specific areas

### Recognition Programs
- **Hall of Fame**: Featured on our website
- **Swag Program**: Foundation OS merchandise
- **Conference Tickets**: Sponsored conference attendance
- **Open Source Fellowship**: $100K/year funding for exceptional contributors

## 📞 Getting Help

Need help contributing?

- **Discord**: Join our developer community
- **GitHub Discussions**: Ask questions and share ideas
- **Office Hours**: Weekly community calls
- **Email**: contribute@foundation-os.dev

## 📜 Code of Conduct

We're committed to providing a welcoming and inspiring community for all. Please read our full [Code of Conduct](CODE_OF_CONDUCT.md).

### Quick Guidelines
- Be respectful and inclusive
- Use welcoming and inclusive language
- Focus on constructive feedback
- Show empathy towards others
- Accept responsibility for mistakes

## 🚀 What's Next?

After your first contribution:

1. **Join our community** channels
2. **Explore advanced features** and integrations
3. **Consider becoming a maintainer** for areas you're passionate about
4. **Share your experience** and help others contribute

## 📚 Resources

- **Documentation**: https://docs.foundation-os.dev
- **API Reference**: https://api.foundation-os.dev
- **Component Library**: https://components.foundation-os.dev
- **Developer Portal**: https://developer.foundation-os.dev

---

**Thank you for contributing to Foundation OS!** 

Together, we're building the future of AI-driven operating systems. Every contribution, big or small, makes a difference.

*Built with ❤️ by the global developer community*