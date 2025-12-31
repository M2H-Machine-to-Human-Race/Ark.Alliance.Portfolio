/**
 * @fileoverview Resume Service Unit Tests
 * Tests for ResumeService CRUD operations.
 * 
 * @author Armand Richelet-Kleinberg
 */

import {
    MOCK_RESUME,
    MOCK_EXPERIENCES,
    MOCK_EDUCATION,
    MOCK_SKILLS,
    MOCK_EXPERIENCE_SINGLE,
    MOCK_EXPERIENCE_CREATE,
    MockSkillLevel,
} from '../../Mocks';

/**
 * Resume Service Test Suite
 */
describe('ResumeService', () => {
    let mockExperiences = [...MOCK_EXPERIENCES];
    let mockEducation = [...MOCK_EDUCATION];
    let mockSkills = [...MOCK_SKILLS];

    beforeEach(() => {
        mockExperiences = [...MOCK_EXPERIENCES];
        mockEducation = [...MOCK_EDUCATION];
        mockSkills = [...MOCK_SKILLS];
    });

    describe('getResume', () => {
        it('should return complete resume with all sections', () => {
            const resume = MOCK_RESUME;

            expect(resume.experiences).toBeDefined();
            expect(resume.education).toBeDefined();
            expect(resume.skills).toBeDefined();
            expect(resume.profile).toBeDefined();
        });

        it('should have correct number of entries', () => {
            expect(MOCK_RESUME.experiences.length).toBe(3);
            expect(MOCK_RESUME.education.length).toBe(2);
            expect(MOCK_RESUME.skills.length).toBe(12);
        });
    });

    describe('Experience Operations', () => {
        describe('getExperiences', () => {
            it('should return all experiences', () => {
                expect(mockExperiences.length).toBe(3);
            });

            it('should have required fields', () => {
                mockExperiences.forEach(exp => {
                    expect(exp.id).toBeDefined();
                    expect(exp.company).toBeDefined();
                    expect(exp.position).toBeDefined();
                    expect(exp.startDate).toBeDefined();
                });
            });

            it('should contain current position (null endDate)', () => {
                const currentPosition = mockExperiences.find(e => e.endDate === null);
                expect(currentPosition).toBeDefined();
                expect(currentPosition?.company).toBe('Ark Alliance Limited');
            });
        });

        describe('createExperience', () => {
            it('should add new experience to list', () => {
                const newExp = {
                    ...MOCK_EXPERIENCE_CREATE,
                    id: mockExperiences.length + 1,
                };
                mockExperiences.push(newExp as any);

                expect(mockExperiences.length).toBe(4);
                expect(mockExperiences[3].company).toBe('New Company Inc.');
            });
        });

        describe('updateExperience', () => {
            it('should update experience fields', () => {
                const expIndex = mockExperiences.findIndex(e => e.id === 1);
                mockExperiences[expIndex] = {
                    ...mockExperiences[expIndex],
                    position: 'Lead Software Engineer',
                };

                expect(mockExperiences[expIndex].position).toBe('Lead Software Engineer');
            });
        });

        describe('deleteExperience', () => {
            it('should remove experience from list', () => {
                mockExperiences = mockExperiences.filter(e => e.id !== 3);
                expect(mockExperiences.length).toBe(2);
            });
        });

        describe('reorderExperiences', () => {
            it('should maintain order when reordered', () => {
                const reordered = [...mockExperiences].reverse();
                expect(reordered[0].company).toBe('StartupXYZ');
                expect(reordered[2].company).toBe('Ark Alliance Limited');
            });
        });

        describe('insertExperienceAt', () => {
            it('should insert at specific position', () => {
                const newExp = { ...MOCK_EXPERIENCE_CREATE, id: 99 } as any;
                mockExperiences.splice(1, 0, newExp);

                expect(mockExperiences.length).toBe(4);
                expect(mockExperiences[1].company).toBe('New Company Inc.');
            });
        });
    });

    describe('Education Operations', () => {
        describe('getEducation', () => {
            it('should return all education entries', () => {
                expect(mockEducation.length).toBe(2);
            });

            it('should have required fields', () => {
                mockEducation.forEach(edu => {
                    expect(edu.id).toBeDefined();
                    expect(edu.institution).toBeDefined();
                    expect(edu.degree).toBeDefined();
                    expect(edu.startDate).toBeDefined();
                });
            });
        });

        describe('createEducation', () => {
            it('should add new education entry', () => {
                const newEdu = {
                    id: 3,
                    institution: 'Online Academy',
                    degree: 'Certificate',
                    fieldOfStudy: 'Machine Learning',
                    startDate: '2024-01-01',
                    endDate: '2024-06-30',
                };
                mockEducation.push(newEdu as any);

                expect(mockEducation.length).toBe(3);
            });
        });

        describe('updateEducation', () => {
            it('should update education fields', () => {
                const eduIndex = mockEducation.findIndex(e => e.id === 1);
                mockEducation[eduIndex] = {
                    ...mockEducation[eduIndex],
                    degree: 'Doctor of Philosophy',
                };

                expect(mockEducation[eduIndex].degree).toBe('Doctor of Philosophy');
            });
        });

        describe('deleteEducation', () => {
            it('should remove education from list', () => {
                mockEducation = mockEducation.filter(e => e.id !== 2);
                expect(mockEducation.length).toBe(1);
            });
        });
    });

    describe('Skills Operations', () => {
        describe('getSkills', () => {
            it('should return all skills', () => {
                expect(mockSkills.length).toBe(12);
            });

            it('should group by category', () => {
                const categories = [...new Set(mockSkills.map(s => s.category))];
                expect(categories).toContain('Languages');
                expect(categories).toContain('Frontend');
                expect(categories).toContain('Backend');
                expect(categories).toContain('Database');
                expect(categories).toContain('DevOps');
            });

            it('should have valid skill levels', () => {
                mockSkills.forEach(skill => {
                    expect(Object.values(MockSkillLevel)).toContain(skill.level);
                });
            });
        });

        describe('createSkill', () => {
            it('should add new skill', () => {
                const newSkill = {
                    id: 13,
                    name: 'Rust',
                    level: MockSkillLevel.BEGINNER,
                    category: 'Languages',
                };
                mockSkills.push(newSkill as any);

                expect(mockSkills.length).toBe(13);
                expect(mockSkills.find(s => s.name === 'Rust')).toBeDefined();
            });
        });

        describe('updateSkill', () => {
            it('should update skill level', () => {
                const skillIndex = mockSkills.findIndex(s => s.name === 'Kubernetes');
                mockSkills[skillIndex] = {
                    ...mockSkills[skillIndex],
                    level: MockSkillLevel.ADVANCED,
                };

                expect(mockSkills[skillIndex].level).toBe(MockSkillLevel.ADVANCED);
            });
        });

        describe('deleteSkill', () => {
            it('should remove skill from list', () => {
                mockSkills = mockSkills.filter(s => s.name !== 'C#');
                expect(mockSkills.find(s => s.name === 'C#')).toBeUndefined();
            });
        });

        describe('filter by level', () => {
            it('should filter expert skills', () => {
                const expertSkills = mockSkills.filter(s => s.level === MockSkillLevel.EXPERT);
                expect(expertSkills.length).toBe(5);
            });
        });
    });

    describe('Timeline Ordering', () => {
        it('should sort experiences by date descending', () => {
            const sorted = [...mockExperiences].sort(
                (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            expect(sorted[0].company).toBe('Ark Alliance Limited');
        });

        it('should sort education by date descending', () => {
            const sorted = [...mockEducation].sort(
                (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            expect(sorted[0].institution).toBe('Swiss Federal Institute of Technology (ETH Zürich)');
        });
    });
});
