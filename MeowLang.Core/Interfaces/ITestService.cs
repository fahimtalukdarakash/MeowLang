using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MeowLang.Core.Entities;

namespace MeowLang.Core.Interfaces
{
    public interface ITestService
    {
        // Check if a writing answer is correct
        bool CheckWritingAnswer(string userAnswer, string correctAnswer, string displayType);
    }
}
