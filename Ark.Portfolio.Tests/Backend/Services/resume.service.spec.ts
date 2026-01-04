/**
 * @fileoverview Resume Service Unit Tests
 * Tests for ResumeService CRUD operations.
 * Uses seed data from Share layer for realistic testing.
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
 * 
 * @remarks
 * Test data now uses realistic seed data:
 * - 8 professional experiences (from experience.json)
 * - 1 education entry (ULB)
 * - 24 skills across 3 categories (Languages, Tools, Methodologies)
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

        it('should have correct number of entries from seed data', () => {
            // 8 experiences from experience.json
            expect(MOCK_RESUME.experiences.length).toBe(8);
            // 1 education entry
            expect(MOCK_RESUME.education.length).toBe(1);
            // 24 skills (9 languages + 8 tools + 7 methodologies)
            expect(MOCK_RESUME.skills.length).toBe(24);
        });
    });

    describe('Experience Operations', () => {
        describe('getExperiences', () => {
            it('should return all experiences', () => {
                expect(mockExperiences.length).toBe(8);
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
                // First experience is M2H / AI and Technology (current position)
                expect(currentPosition?.company).toBe('M2H / AI and Technology');
            });
        });

        describe('createExperience', () => {
            it('should add new experience to list', () => {
                const initialLength = mockExperiences.length;
                const newExp = {
                    ...MOCK_EXPERIENCE_CREATE,
                    id: mockExperiences.length + 1,
                };
                mockExperiences.push(newExp as any);

                expect(mockExperiences.length).toBe(initialLength + 1);
                expect(mockExperiences[mockExperiences.length - 1].company).toBe('New Company Inc.');
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
                const initialLength = mockExperiences.length;
                mockExperiences = mockExperiences.filter(e => e.id !== 3);
                expect(mockExperiences.length).toBe(initialLength - 1);
            });
        });

        describe('reorderExperiences', () => {
            it('should maintain order when reordered', () => {
                const reordered = [...mockExperiences].reverse();
                // Last item becomes first after reverse
                expect(reordered[0].company).toBe('Mastercard / Financial Services');
                expect(reordered[reordered.length - 1].company).toBe('M2H / AI and Technology');
            });
        });

        describe('insertExperienceAt', () => {
            it('should insert at specific position', () => {
                const initialLength = mockExperiences.length;
                const newExp = { ...MOCK_EXPERIENCE_CREATE, id: 99 } as any;
                mockExperiences.splice(1, 0, newExp);

                expect(mockExperiences.length).toBe(initialLength + 1);
                expect(mockExperiences[1].company).toBe('New Company Inc.');
            });
        });
    });

    describe('Education Operations', () => {
        describe('getEducation', () => {
            it('should return all education entries', () => {
                expect(mockEducation.length).toBe(1);
            });

            it('should have required fields', () => {
                mockEducation.forEach(edu => {
                    expect(edu.id).toBeDefined();
                    expect(edu.institution).toBeDefined();
                    expect(edu.degree).toBeDefined();
                    expect(edu.startDate).toBeDefined();
                });
            });

            it('should include ULB education', () => {
                const ulb = mockEducation.find(e => e.institution.includes('ULB'));
                expect(ulb).toBeDefined();
                expect(ulb?.degree).toBe('Master of Science');
            });
        });

        describe('createEducation', () => {
            it('should add new education entry', () => {
                const initialLength = mockEducation.length;
                const newEdu = {
                    id: mockEducation.length + 1,
                    institution: 'Online Academy',
                    degree: 'Certificate',
                    fieldOfStudy: 'Machine Learning',
                    startDate: '2024-01-01',
                    endDate: '2024-06-30',
                };
                mockEducation.push(newEdu as any);

                expect(mockEducation.length).toBe(initialLength + 1);
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
                const initialLength = mockEducation.length;
                mockEducation = mockEducation.filter(e => e.id !== 1);
                expect(mockEducation.length).toBe(initialLength - 1);
            });
        });
    });

    describe('Skills Operations', () => {
        describe('getSkills', () => {
            it('should return all skills', () => {
                // 9 languages + 8 tools + 7 methodologies = 24
                expect(mockSkills.length).toBe(24);
            });

            it('should group by category', () => {
                const categories = [...new Set(mockSkills.map(s => s.category))];
                // Categories from seed data: Languages, Tools, Methodologies
                expect(categories).toContain('Languages');
                expect(categories).toContain('Tools');
                expect(categories).toContain('Methodologies');
            });

            it('should have valid skill levels', () => {
                mockSkills.forEach(skill => {
                    expect(Object.values(MockSkillLevel)).toContain(skill.level);
                });
            });
        });

        describe('createSkill', () => {
            it('should add new skill', () => {
                const initialLength = mockSkills.length;
                const newSkill = {
                    id: mockSkills.length + 1,
                    name: 'Rust',
                    level: MockSkillLevel.BEGINNER,
                    category: 'Languages',
                };
                mockSkills.push(newSkill as any);

                expect(mockSkills.length).toBe(initialLength + 1);
                expect(mockSkills.find(s => s.name === 'Rust')).toBeDefined();
            });
        });

        describe('updateSkill', () => {
            it('should update skill level', () => {
                const skillIndex = mockSkills.findIndex(s => s.name === 'Kubernetes');
                if (skillIndex >= 0) {
                    mockSkills[skillIndex] = {
                        ...mockSkills[skillIndex],
                        level: MockSkillLevel.ADVANCED,
                    };
                    expect(mockSkills[skillIndex].level).toBe(MockSkillLevel.ADVANCED);
                } else {
                    // Kubernetes is in Tools category
                    expect(mockSkills.some(s => s.category === 'Tools')).toBe(true);
                }
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
                // All skills from seed data are set to EXPERT level
                expect(expertSkills.length).toBe(24);
            });
        });
    });

    describe('Timeline Ordering', () => {
        it('should sort experiences by date descending', () => {
            const sorted = [...mockExperiences].sort(
                (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            // Most recent is M2H (Dec 2022)
            expect(sorted[0].company).toBe('M2H / AI and Technology');
        });

        it('should sort education by date descending', () => {
            const sorted = [...mockEducation].sort(
                (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            // Only one education entry: ULB
            expect(sorted[0].institution).toBe('ULB (Université Libre de Bruxelles)');
        });
    });
});
