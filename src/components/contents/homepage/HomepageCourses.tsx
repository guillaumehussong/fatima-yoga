import React, { useEffect, useRef } from 'react';
import { courses } from '../common/courses';
import { CourseType } from '@prisma/client';
import { Grid, Typography, Chip, CardContent, Card, CardActionArea, CardMedia, Grow } from '@mui/material';
import { Accessibility, AccessTime, DarkMode, Groups } from '@mui/icons-material';
import { CourseTypeNames } from '../../../common/course';
import Link from 'next/link';

interface HomepageCourseProps {
  course: typeof courses[CourseType];
  imageUrl: string;
  index: number;
  children: React.ReactNode;
}

const HomepageCourse: React.FC<HomepageCourseProps> = ({ course, imageUrl, index, children }) => {
  const { type, age, level, group, duration, anchor } = course;

  const isEven = index % 2 === 0;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fade-in">
      <Grow in timeout={(1 + index) * 500}>
        <Grid container spacing={2} sx={{ mb: 8 }}>
          {isEven ? (
            <>
              <Grid item xs={12} md={8} sx={{ pr: { xs: 2, md: 6 }, display: 'flex' }}>
                <Link href={`/seances#${anchor}`} passHref legacyBehavior>
                  <CardActionArea sx={{ flex: 1, height: '100%' }}>
                    <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <CardContent sx={{ textAlign: 'center', paddingX: 10 }}>
                        <Typography component="h2" variant="h5" sx={{ mb: 8 }}>
                          Sesiones de {CourseTypeNames[type]}
                        </Typography>
                        {children}
                        <Grid container justifyContent="center" sx={{ pt: { xs: 2, md: 6 }, display: 'flex' }}>
                          <Chip icon={<Accessibility />} label={age} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<DarkMode />} label={level} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<Groups />} label={group} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<AccessTime />} label={duration} variant="outlined" sx={{ m: 0.5 }} />
                        </Grid>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Link>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Link href={`/seances#${anchor}`} passHref legacyBehavior>
                  <Card elevation={4} sx={{ flex: 1, height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      image={imageUrl}
                      alt="Image d'illustration"
                    />
                  </Card>
                </Link>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Link href={`/seances#${anchor}`} passHref legacyBehavior>
                  <Card elevation={4} sx={{ flex: 1, height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      image={imageUrl}
                      alt="Image d'illustration"
                    />
                  </Card>
                </Link>
              </Grid>
              <Grid item xs={12} md={8} sx={{ pl: { xs: 2, md: 6 }, display: 'flex', paddingLeft: { xs: '16px !important', md: '68px !important' } }}>
                <Link href={`/seances#${anchor}`} passHref legacyBehavior>
                  <CardActionArea sx={{ flex: 1, height: '100%' }}>
                    <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <CardContent sx={{ textAlign: 'center', paddingX: 10}}>
                        <Typography component="h2" variant="h5" sx={{ mb: 8 }}>
                          Sesiones de {CourseTypeNames[type]}
                        </Typography>
                        {children}
                        <Grid container justifyContent="center" sx={{ pt: { xs: 2, md: 6 }, display: 'flex' }}>
                          <Chip icon={<Accessibility />} label={age} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<DarkMode />} label={level} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<Groups />} label={group} variant="outlined" sx={{ m: 0.5 }} />
                          <Chip icon={<AccessTime />} label={duration} variant="outlined" sx={{ m: 0.5 }} />
                        </Grid>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </Grow>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transition: opacity 3s ease-in-out; /* Augmenter le temps d'apparition ici */
        }

        .fade-in.visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

interface HomepageCoursesProps {
  children: React.ReactNode;
}

const HomepageCourses: React.FC<HomepageCoursesProps> & { Course: typeof HomepageCourse } = ({ children }) => {
  return (
    <Grid container spacing={4} sx={{ mb: 3 }}>
      {children}
    </Grid>
  );
};

HomepageCourses.Course = HomepageCourse;

export { HomepageCourses };