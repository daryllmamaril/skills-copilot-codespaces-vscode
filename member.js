function skillsMember() {
  return {
    skills: ['JavaScript', 'HTML', 'CSS'],
    addSkill: function(skill) {
      this.skills.push(skill);
    }
  };
}